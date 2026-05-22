import { NextResponse } from "next/server";
import { adminCredentialsConfigured, createAdminToken, verifyAdminCredentials } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email?.trim().toLowerCase() || "";
  const password = body.password || "";

  if (!adminCredentialsConfigured()) {
    return NextResponse.json({ error: "管理员账号尚未配置，请设置 ADMIN_EMAIL 和 ADMIN_PASSWORD。" }, { status: 500 });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "请输入管理员邮箱和密码。" }, { status: 400 });
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json({ error: "管理员账号或密码不正确。" }, { status: 401 });
  }

  return NextResponse.json({
    admin: { email },
    token: createAdminToken(email)
  });
}
