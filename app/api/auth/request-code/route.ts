import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { sendLoginCode } from "@/lib/mailer";

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

  const emailStatus = await sendLoginCode(email, code);
  return NextResponse.json({ emailStatus });
}
