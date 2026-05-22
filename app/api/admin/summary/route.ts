import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb } from "@/lib/db";

export async function GET(request: Request) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const db = await readDb();
  return NextResponse.json({
    summary: {
      users: db.users.length,
      bookings: db.bookings.length,
      pendingBookings: db.bookings.filter((booking) => booking.status === "pending").length,
      orders: db.orders.length,
      paidOrders: db.orders.filter((order) => order.status === "paid").length
    }
  });
}
