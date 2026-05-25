import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { courseOrderFromId, createStripeCheckoutSession } from "@/lib/stripe";
import { markOrderPaid } from "@/lib/wallet";

export async function POST(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Please register or log in before purchasing." }, { status: 401 });

  const body = (await request.json()) as { courseId?: string; bookingId?: string; orderId?: string };

  const db = await readDb();
  let order = body.orderId ? db.orders.find((item) => item.id === body.orderId && item.userId === session.sub) : null;

  if (!order) {
    const booking = body.bookingId ? db.bookings.find((item) => item.id === body.bookingId && item.userId === session.sub) : null;
    const courseData = booking
      ? {
          courseId: booking.project || booking.stage,
          courseName: `${booking.project || booking.stage} Booking`,
          amount: booking.amount || 49
        }
      : courseOrderFromId(body.courseId || "");

    if (!courseData) return NextResponse.json({ error: "Course or booking not found." }, { status: 404 });

    order = {
      id: crypto.randomUUID(),
      userId: session.sub,
      bookingId: booking?.id,
      courseId: courseData.courseId,
      courseName: courseData.courseName,
      amount: courseData.amount,
      currency: "USD" as const,
      status: process.env.STRIPE_SECRET_KEY ? ("pending" as const) : ("paid" as const),
      createdAt: new Date().toISOString()
    };

    db.orders.push(order);
    if (booking) {
      booking.orderId = order.id;
      booking.paymentStatus = order.status === "paid" ? "paid" : "pending";
    }
    if (order.status === "paid") markOrderPaid(db, order);
    await writeDb(db);
  }

  if (order.status === "paid") {
    return NextResponse.json({ order, checkoutUrl: `/success?order=${order.id}` });
  }

  const stripeCheckout = await createStripeCheckoutSession(request, order);
  if (stripeCheckout?.id) {
    order.stripeSessionId = stripeCheckout.id;
    await writeDb(db);
  }

  return NextResponse.json({
    order,
    checkoutUrl: stripeCheckout?.url || `/success?order=${order.id}`
  });
}
