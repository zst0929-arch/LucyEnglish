import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { userBalance } from "@/lib/wallet";
import type { Withdrawal } from "@/lib/types";

export async function GET(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await readDb();
  return NextResponse.json({
    withdrawals: (db.withdrawals || [])
      .filter((withdrawal) => withdrawal.userId === session.sub)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export async function POST(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as { amount?: number | string };
  const amount = Math.round(Number(body.amount || 0) * 100) / 100;
  if (!Number.isFinite(amount) || amount <= 0) {
    return NextResponse.json({ error: "Withdrawal amount must be greater than 0." }, { status: 400 });
  }

  const db = await readDb();
  const account = (db.walletAccounts || []).find((item) => item.userId === session.sub);
  if (!account) return NextResponse.json({ error: "Please bind a payout account first." }, { status: 400 });

  const balance = userBalance(db, session.sub);
  if (amount > balance) return NextResponse.json({ error: "Insufficient available balance." }, { status: 400 });

  db.withdrawals ||= [];
  const withdrawal: Withdrawal = {
    id: crypto.randomUUID(),
    userId: session.sub,
    amount,
    currency: "USD",
    status: "pending",
    accountLast4: account.accountLast4,
    stripeConnectAccountId: account.stripeConnectAccountId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  db.withdrawals.push(withdrawal);
  await writeDb(db);
  return NextResponse.json({ withdrawal });
}
