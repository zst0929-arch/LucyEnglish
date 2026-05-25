import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { readDb } from "@/lib/db";

export async function GET(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await readDb();
  return NextResponse.json({
    orders: db.orders
      .filter((order) => order.userId === session.sub)
      .map((order) => ({
        ...order,
        booking: order.bookingId ? db.bookings.find((booking) => booking.id === order.bookingId) || null : null
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}
