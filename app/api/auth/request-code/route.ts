import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { sendLoginCode } from "@/lib/mailer";

function canExposeDevCode(request: Request) {
  const hostname = new URL(request.url).hostname;
  return process.env.SHOW_LOGIN_CODE === "true" || hostname === "localhost" || hostname === "127.0.0.1";
}

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase();

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 400 });
  }

  const code = String(Math.floor(100000 + Math.random() * 900000));
  const db = await readDb();
  db.loginCodes = (db.loginCodes || []).filter(
    (entry) => entry.email !== email && new Date(entry.expiresAt).getTime() > Date.now()
  );
  db.loginCodes.push({
    email,
    codeHash: hashPassword(code),
    expiresAt: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
    createdAt: new Date().toISOString()
  });
  await writeDb(db);

  let emailStatus: Awaited<ReturnType<typeof sendLoginCode>> & { devCode?: string };
  try {
    emailStatus = await sendLoginCode(email, code);
  } catch (error) {
    console.error("Login code email failed", error);
    emailStatus = {
      sent: false,
      reason: error instanceof Error ? error.message : "Verification email could not be sent."
    };
  }

  if (!emailStatus.sent && canExposeDevCode(request)) {
    emailStatus.devCode = code;
  }

  return NextResponse.json({ emailStatus });
}
