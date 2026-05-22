import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb } from "@/lib/db";

export async function GET(request: Request) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const db = await readDb();
  return NextResponse.json({
    bookings: db.bookings
      .map((booking) => ({
        ...booking,
        user: db.users.find((user) => user.id === booking.userId) || null
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}
