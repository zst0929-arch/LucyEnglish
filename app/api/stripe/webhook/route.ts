import crypto from "crypto";
import { NextResponse } from "next/server";
import { readDb, writeDb } from "@/lib/db";
import { markOrderPaid } from "@/lib/wallet";

function verifyStripeSignature(payload: string, signatureHeader: string | null) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return false;
  if (!signatureHeader) return false;

  const parts = Object.fromEntries(
    signatureHeader.split(",").map((part) => {
      const [key, value] = part.split("=");
      return [key, value];
    })
  );
  const timestamp = parts.t;
  const signature = parts.v1;
  if (!timestamp || !signature) return false;

  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const left = Buffer.from(signature, "hex");
  const right = Buffer.from(expected, "hex");
  return left.length === right.length && crypto.timingSafeEqual(left, right);
}

export async function POST(request: Request) {
  const payload = await request.text();
  if (!verifyStripeSignature(payload, request.headers.get("stripe-signature"))) {
    return NextResponse.json({ error: "Invalid Stripe webhook signature." }, { status: 400 });
  }

  const event = JSON.parse(payload) as {
    type?: string;
    data?: { object?: { id?: string; client_reference_id?: string; metadata?: Record<string, string>; payment_status?: string } };
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data?.object;
    const orderId = session?.metadata?.orderId || session?.client_reference_id;
    if (orderId) {
      const db = await readDb();
      const order = db.orders.find((item) => item.id === orderId);
      if (order) {
        order.stripeSessionId ||= session?.id;
        markOrderPaid(db, order);
        await writeDb(db);
      }
    }
  }

  if (event.type === "checkout.session.expired") {
    const session = event.data?.object;
    const orderId = session?.metadata?.orderId || session?.client_reference_id;
    if (orderId) {
      const db = await readDb();
      const order = db.orders.find((item) => item.id === orderId);
      if (order && order.status === "pending") {
        order.status = "failed";
        if (order.bookingId) {
          const booking = db.bookings.find((item) => item.id === order.bookingId);
          if (booking) booking.paymentStatus = "failed";
        }
        await writeDb(db);
      }
    }
  }

  return NextResponse.json({ received: true });
}
