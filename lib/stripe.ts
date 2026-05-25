import { courses } from "./courses";
import type { Order } from "./types";

export async function createStripeCheckoutSession(request: Request, order: Order) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const params = new URLSearchParams({
    mode: "payment",
    success_url: `${origin}/success?order=${order.id}`,
    cancel_url: `${origin}/#contact`,
    client_reference_id: order.id,
    "metadata[orderId]": order.id,
    "metadata[userId]": order.userId,
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(Math.round(order.amount * 100)),
    "line_items[0][price_data][product_data][name]": order.courseName,
    "line_items[0][price_data][product_data][description]": "$49 USD per hour / 每小时 49 美元"
  });

  if (order.bookingId) params.set("metadata[bookingId]", order.bookingId);
  if (order.courseId) params.set("metadata[courseId]", order.courseId);

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const session = (await response.json()) as { id?: string; url?: string; error?: { message?: string } };
  if (!response.ok || !session.url) {
    throw new Error(session.error?.message || "Stripe Checkout session could not be created.");
  }

  return { id: session.id || "", url: session.url };
}

export async function createStripeTransfer(withdrawalId: string, amount: number, destination: string) {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) return null;

  const params = new URLSearchParams({
    amount: String(Math.round(amount * 100)),
    currency: "usd",
    destination,
    "metadata[withdrawalId]": withdrawalId
  });

  const response = await fetch("https://api.stripe.com/v1/transfers", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: params
  });

  const transfer = (await response.json()) as { id?: string; error?: { message?: string } };
  if (!response.ok || !transfer.id) {
    throw new Error(transfer.error?.message || "Stripe transfer could not be created.");
  }
  return transfer.id;
}

export function courseOrderFromId(courseId: string) {
  const course = courses.find((item) => item.id === courseId);
  if (!course) return null;
  return {
    courseId: course.id,
    courseName: `${course.title.en} - 1 Hour Lesson`,
    amount: course.price
  };
}
