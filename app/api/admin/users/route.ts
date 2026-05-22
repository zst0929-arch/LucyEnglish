import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { publicUser, readDb } from "@/lib/db";

export async function GET(request: Request) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const db = await readDb();
  return NextResponse.json({
    users: db.users.map(publicUser).sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}
