import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb, writeDb } from "@/lib/db";
import { sendBookingConfirmation } from "@/lib/mailer";
import type { Booking } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: Booking["status"] };
  if (!body.status || !["pending", "confirmed", "completed", "cancelled"].includes(body.status)) {
    return NextResponse.json({ error: "预约状态不正确。" }, { status: 400 });
  }

  const db = await readDb();
  const booking = db.bookings.find((item) => item.id === id);
  if (!booking) return NextResponse.json({ error: "预约不存在。" }, { status: 404 });

  const shouldSendConfirmation = booking.status === "pending" && body.status === "confirmed";
  booking.status = body.status;
  await writeDb(db);

  let emailStatus: Awaited<ReturnType<typeof sendBookingConfirmation>> | null = null;
  if (shouldSendConfirmation) {
    try {
      emailStatus = await sendBookingConfirmation(booking);
    } catch (error) {
      console.error("Booking confirmation email failed", error);
      emailStatus = {
        sent: false,
        reason: error instanceof Error ? error.message : "Unknown email error."
      };
    }
  }

  return NextResponse.json({ booking, emailStatus });
}
