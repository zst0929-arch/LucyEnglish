import crypto from "crypto";
import type { Database, Order, WalletTransaction } from "./types";

export function userBalance(db: Database, userId: string) {
  return (db.walletTransactions || [])
    .filter((entry) => entry.userId === userId)
    .reduce((total, entry) => total + (entry.type === "credit" ? entry.amount : -entry.amount), 0);
}

export function creditPaidOrder(db: Database, order: Order) {
  if (order.status !== "paid") return;
  db.walletTransactions ||= [];
  const exists = db.walletTransactions.some((entry) => entry.sourceType === "order" && entry.sourceId === order.id && entry.type === "credit");
  if (exists) return;

  const entry: WalletTransaction = {
    id: crypto.randomUUID(),
    userId: order.userId,
    type: "credit",
    amount: order.amount,
    currency: "USD",
    sourceType: "order",
    sourceId: order.id,
    note: `Paid order: ${order.courseName}`,
    createdAt: new Date().toISOString()
  };
  db.walletTransactions.push(entry);
}

export function markOrderPaid(db: Database, order: Order, paidAt = new Date().toISOString()) {
  order.status = "paid";
  order.paidAt ||= paidAt;
  if (order.bookingId) {
    const booking = db.bookings.find((item) => item.id === order.bookingId);
    if (booking) {
      booking.paymentStatus = "paid";
      booking.orderId = order.id;
    }
  }
  creditPaidOrder(db, order);
}

export function debitWithdrawal(db: Database, withdrawalId: string, userId: string, amount: number) {
  db.walletTransactions ||= [];
  const exists = db.walletTransactions.some((entry) => entry.sourceType === "withdrawal" && entry.sourceId === withdrawalId && entry.type === "debit");
  if (exists) return;
  db.walletTransactions.push({
    id: crypto.randomUUID(),
    userId,
    type: "debit",
    amount,
    currency: "USD",
    sourceType: "withdrawal",
    sourceId: withdrawalId,
    note: "Withdrawal approved",
    createdAt: new Date().toISOString()
  });
}
