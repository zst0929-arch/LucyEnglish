import { NextResponse } from "next/server";
import { createToken, verifyPassword } from "@/lib/auth";
import { publicUser, readDb } from "@/lib/db";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const db = await readDb();
  const user = db.users.find((candidate) => candidate.email === email);
  if (!user || !verifyPassword(password, user.passwordHash)) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  return NextResponse.json({
    user: publicUser(user),
    token: createToken(user)
  });
}
