import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb, writeDb } from "@/lib/db";
import { markOrderPaid } from "@/lib/wallet";
import type { Order } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: Order["status"] };
  if (body.status !== "pending" && body.status !== "paid" && body.status !== "failed") {
    return NextResponse.json({ error: "订单状态不正确。" }, { status: 400 });
  }

  const db = await readDb();
  const order = db.orders.find((item) => item.id === id);
  if (!order) return NextResponse.json({ error: "订单不存在。" }, { status: 404 });

  if (body.status === "paid") {
    markOrderPaid(db, order);
  } else {
    order.status = body.status;
    if (order.bookingId) {
      const booking = db.bookings.find((item) => item.id === order.bookingId);
      if (booking) booking.paymentStatus = body.status === "failed" ? "failed" : "pending";
    }
  }
  await writeDb(db);

  return NextResponse.json({ order });
}
