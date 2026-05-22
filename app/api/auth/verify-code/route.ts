import { NextResponse } from "next/server";
import { createToken, verifyPassword } from "@/lib/auth";
import { publicUser, readDb, writeDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; code?: string; name?: string };
  const email = body.email?.trim().toLowerCase();
  const code = body.code?.trim() || "";
  const name = body.name?.trim();

  if (!email || !code) {
    return NextResponse.json({ error: "Email and verification code are required." }, { status: 400 });
  }

  const db = await readDb();
  const loginCodes = db.loginCodes || [];
  const entry = loginCodes
    .filter((candidate) => candidate.email === email)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];

  if (!entry || new Date(entry.expiresAt).getTime() < Date.now() || !verifyPassword(code, entry.codeHash)) {
    return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 401 });
  }

  let user = db.users.find((candidate) => candidate.email === email);
  if (!user) {
    user = {
      id: crypto.randomUUID(),
      name: name || email.split("@")[0] || "Learner",
      email,
      passwordHash: "",
      createdAt: new Date().toISOString()
    };
    db.users.push(user);
  }

  db.loginCodes = loginCodes.filter((candidate) => candidate.email !== email);
  await writeDb(db);

  return NextResponse.json({
    user: publicUser(user),
    token: createToken(user)
  });
}
