import { NextResponse } from "next/server";
import { createToken, hashPassword } from "@/lib/auth";
import { publicUser, readDb, writeDb } from "@/lib/db";
import { sendRegistrationNotification } from "@/lib/mailer";

export async function POST(request: Request) {
  const body = (await request.json()) as { name?: string; email?: string; password?: string };
  const name = body.name?.trim();
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";

  if (!name || !email || password.length < 8) {
    return NextResponse.json(
      { error: "Please provide name, email, and a password with at least 8 characters." },
      { status: 400 }
    );
  }

  const db = await readDb();
  if (db.users.some((user) => user.email === email)) {
    return NextResponse.json({ error: "This email is already registered." }, { status: 409 });
  }

  const user = {
    id: crypto.randomUUID(),
    name,
    email,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString()
  };

  db.users.push(user);
  await writeDb(db);

  let registrationEmailStatus: Awaited<ReturnType<typeof sendRegistrationNotification>>;
  try {
    registrationEmailStatus = await sendRegistrationNotification(user, "Password registration / 密码注册");
  } catch (error) {
    console.error("Registration admin notification failed", error);
    registrationEmailStatus = {
      sent: false,
      reason: error instanceof Error ? error.message : "Unknown email error."
    };
  }

  return NextResponse.json({
    user: publicUser(user),
    token: createToken(user),
    registrationEmailStatus
  });
}
