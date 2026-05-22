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
    nationality?: string;
    stage?: string;
    chineseLevel?: string;
    date?: string;
    message?: string;
  };

  if (!body.name || !body.email || !body.stage || !body.date) {
    return NextResponse.json({ error: "Name, email, stage, and preferred date are required." }, { status: 400 });
  }

  const db = await readDb();
  const booking = {
    id: crypto.randomUUID(),
    userId: session.sub,
    name: body.name.trim(),
    email: body.email.trim().toLowerCase(),
    nationality: body.nationality?.trim() || "",
    stage: body.stage,
    chineseLevel: body.chineseLevel || "beginner",
    date: body.date,
    message: body.message?.trim() || "",
    status: "pending" as const,
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
