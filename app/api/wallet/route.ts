import { NextResponse } from "next/server";
import { tokenFromRequest, verifyToken } from "@/lib/auth";
import { readDb, writeDb } from "@/lib/db";
import { accountLast4, encryptField } from "@/lib/secure-fields";
import { userBalance } from "@/lib/wallet";
import type { WalletAccount } from "@/lib/types";

export async function GET(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await readDb();
  const account = (db.walletAccounts || []).find((item) => item.userId === session.sub);
  return NextResponse.json({
    balance: userBalance(db, session.sub),
    account: account
      ? {
          holderName: account.holderName,
          accountType: account.accountType,
          accountLast4: account.accountLast4,
          stripeConnectAccountId: account.stripeConnectAccountId || "",
          updatedAt: account.updatedAt
        }
      : null,
    transactions: (db.walletTransactions || [])
      .filter((entry) => entry.userId === session.sub)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    withdrawals: (db.withdrawals || [])
      .filter((entry) => entry.userId === session.sub)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
  });
}

export async function PATCH(request: Request) {
  const session = verifyToken(tokenFromRequest(request));
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as {
    holderName?: string;
    accountType?: WalletAccount["accountType"];
    accountIdentifier?: string;
    stripeConnectAccountId?: string;
  };

  if (!body.holderName?.trim() || !body.accountIdentifier?.trim() || !body.accountType) {
    return NextResponse.json({ error: "Holder name, account type, and account details are required." }, { status: 400 });
  }

  const accountType = body.accountType;
  if (!["bank", "paypal", "stripe-connect", "other"].includes(accountType)) {
    return NextResponse.json({ error: "Unsupported account type." }, { status: 400 });
  }

  const db = await readDb();
  db.walletAccounts ||= [];
  const existing = db.walletAccounts.find((item) => item.userId === session.sub);
  const account: WalletAccount = {
    userId: session.sub,
    holderName: body.holderName.trim(),
    accountType,
    encryptedAccount: encryptField(body.accountIdentifier.trim()),
    accountLast4: accountLast4(body.accountIdentifier),
    stripeConnectAccountId: body.stripeConnectAccountId?.trim() || undefined,
    updatedAt: new Date().toISOString()
  };

  if (existing) Object.assign(existing, account);
  else db.walletAccounts.push(account);

  await writeDb(db);
  return NextResponse.json({
    account: {
      holderName: account.holderName,
      accountType: account.accountType,
      accountLast4: account.accountLast4,
      stripeConnectAccountId: account.stripeConnectAccountId || "",
      updatedAt: account.updatedAt
    }
  });
}
