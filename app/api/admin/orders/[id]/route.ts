import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb, writeDb } from "@/lib/db";
import type { Order } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: Order["status"] };
  if (body.status !== "pending" && body.status !== "paid") {
    return NextResponse.json({ error: "订单状态不正确。" }, { status: 400 });
  }

  const db = await readDb();
  const order = db.orders.find((item) => item.id === id);
  if (!order) return NextResponse.json({ error: "订单不存在。" }, { status: 404 });

  order.status = body.status;
  await writeDb(db);

  return NextResponse.json({ order });
}
