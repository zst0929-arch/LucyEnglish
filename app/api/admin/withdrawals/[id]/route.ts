import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-api";
import { readDb, writeDb } from "@/lib/db";
import { createStripeTransfer } from "@/lib/stripe";
import { debitWithdrawal, userBalance } from "@/lib/wallet";
import type { Withdrawal } from "@/lib/types";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: RouteContext) {
  const { response } = requireAdmin(request);
  if (response) return response;

  const { id } = await context.params;
  const body = (await request.json()) as { status?: Withdrawal["status"]; adminNote?: string };
  if (!body.status || !["approved", "rejected", "transferred"].includes(body.status)) {
    return NextResponse.json({ error: "提现状态不正确。" }, { status: 400 });
  }

  const db = await readDb();
  const withdrawal = (db.withdrawals || []).find((item) => item.id === id);
  if (!withdrawal) return NextResponse.json({ error: "提现单不存在。" }, { status: 404 });
  if (withdrawal.status === "transferred" || withdrawal.status === "rejected") {
    return NextResponse.json({ error: "该提现单已完成处理，不能重复操作。" }, { status: 400 });
  }

  if (body.status === "rejected") {
    withdrawal.status = "rejected";
    withdrawal.adminNote = body.adminNote?.trim() || "Rejected by admin";
    withdrawal.updatedAt = new Date().toISOString();
    await writeDb(db);
    return NextResponse.json({ withdrawal });
  }

  const balance = userBalance(db, withdrawal.userId);
  if (withdrawal.amount > balance) {
    return NextResponse.json({ error: "用户可提现余额不足，无法审核通过。" }, { status: 400 });
  }

  if (body.status === "transferred" && withdrawal.stripeConnectAccountId) {
    const transferId = await createStripeTransfer(withdrawal.id, withdrawal.amount, withdrawal.stripeConnectAccountId);
    if (transferId) withdrawal.stripeTransferId = transferId;
  }

  withdrawal.status = body.status;
  withdrawal.adminNote = body.adminNote?.trim() || (body.status === "transferred" ? "Transferred" : "Approved");
  withdrawal.updatedAt = new Date().toISOString();
  if (body.status === "approved" || body.status === "transferred") {
    debitWithdrawal(db, withdrawal.id, withdrawal.userId, withdrawal.amount);
  }

  await writeDb(db);
  return NextResponse.json({ withdrawal });
}
