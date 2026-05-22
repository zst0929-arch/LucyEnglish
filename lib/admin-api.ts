import { NextResponse } from "next/server";
import { tokenFromRequest, verifyAdminToken } from "./auth";

export function requireAdmin(request: Request) {
  const session = verifyAdminToken(tokenFromRequest(request));
  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Unauthorized admin request." }, { status: 401 })
    };
  }

  return { session, response: null };
}
