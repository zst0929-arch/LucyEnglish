import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { sendBookingNotification } from "@/lib/mailer";

export async function GET(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await readDb();
  return NextResponse.json({
    bookings: db.bookings
      .filter((booking) => booking.userId === session.sub)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export async function POST(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Please register or log in before booking." }, { status: 401 });

  const body = (await request.json()) as {
    name?: string;
    email?: string;
    contact?: string;
    nationality?: string;
    stage?: string;
    project?: string;
    chineseLevel?: string;
    date?: string;
    serviceDate?: string;
    people?: string | number;
    message?: string;
    remarks?: string;
  };

  if (!body.name || !body.email || !body.stage || !body.date) {
    return NextResponse.json({ error: "Name, contact email, booking project, and service date are required." }, { status: 400 });
  }

  const db = await readDb();
  const people = Math.max(1, Number(body.people || 1) || 1);
  const booking = {
    id: crypto.randomUUID(),
    userId: session.sub,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    contact: body.contact?.trim() || body.email.trim().toLowerCase(),
    nationality: body.nationality?.trim() || "",
    stage: body.stage,
    project: body.project?.trim() || body.stage,
    chineseLevel: body.chineseLevel || "beginner",
    date: body.date,
    serviceDate: body.serviceDate || body.date,
    people,
    message: body.message?.trim() || "",
    remarks: body.remarks?.trim() || body.message?.trim() || "",
    status: "pending" as const,
    paymentStatus: "unpaid" as const,
    amount: 49 * people,
    createdAt: new Date().toISOString()
  };

  db.bookings.push(booking);
  await writeDb(db);

  let emailStatus: Awaited<ReturnType<typeof sendBookingNotification>>;
  try {
    emailStatus = await sendBookingNotification(booking);
  } catch (error) {
    console.error("Booking email notification failed", error);
    emailStatus = {
      sent: false,
      reason: error instanceof Error ? error.message : "Unknown email error."
    };
  }

  return NextResponse.json({ booking, emailStatus });
}
