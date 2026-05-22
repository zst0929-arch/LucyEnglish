import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { courses } from "@/lib/courses";
import { readDb, writeDb } from "@/lib/db";

async function createStripeCheckoutSession(request: Request, orderId: string, course: (typeof courses)[number]) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/success?order=${orderId}`,
    cancel_url: `${origin}/#courses`,
    client_reference_id: orderId,
    "metadata[orderId]": orderId,
    "metadata[courseId]": course.id,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(course.price * 100),
    "line_items[0][price_data][product_data][name]": `${course.title.en} - 1 Hour Chinese Lesson`,
    "line_items[0][price_data][product_data][description]": "$49 USD per hour / 每小时 49 美元"
  });

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const session = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok || !session.url) {
    throw new Error(session.error?.message || "Stripe Checkout session could not be created.");
  }

  return session.url;
}

export async function POST(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Please register or log in before purchasing." }, { status: 401 });

  const body = (await request.json()) as { courseId?: string };
  const course = courses.find((item) => item.id === body.courseId);
  if (!course) return NextResponse.json({ error: "Course not found." }, { status: 404 });

  const db = await readDb();
  const order = {
    id: crypto.randomUUID(),
    userId: session.sub,
    courseId: course.id,
    courseName: course.title.en,
    amount: course.price,
    currency: "USD" as const,
    status: process.env.STRIPE_SECRET_KEY ? ("pending" as const) : ("paid" as const),
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  await writeDb(db);

  const stripeCheckoutUrl = await createStripeCheckoutSession(request, order.id, course);

  return NextResponse.json({
    order,
    checkoutUrl: stripeCheckoutUrl || `/success?order=${order.id}`
  });
}
