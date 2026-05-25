export type Language = "en" | "zh";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

export type Booking = {
  id: string;
  userId: string;
  name: string;
  email: string;
  contact?: string;
  nationality: string;
  stage: string;
  project?: string;
  chineseLevel: string;
  date: string;
  serviceDate?: string;
  people?: number;
  message: string;
  remarks?: string;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paymentStatus?: "unpaid" | "pending" | "paid" | "failed";
  orderId?: string;
  amount?: number;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  bookingId?: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: "USD";
  status: "paid" | "pending" | "failed";
  stripeSessionId?: string;
  paidAt?: string;
  paymentNotificationSentAt?: string;
  createdAt: string;
};

export type WalletAccount = {
  userId: string;
  holderName: string;
  accountType: "bank" | "paypal" | "stripe-connect" | "other";
  encryptedAccount: string;
  accountLast4: string;
  stripeConnectAccountId?: string;
  updatedAt: string;
};

export type WalletTransaction = {
  id: string;
  userId: string;
  type: "credit" | "debit";
  amount: number;
  currency: "USD";
  sourceType: "order" | "withdrawal" | "adjustment";
  sourceId: string;
  note: string;
  createdAt: string;
};

export type Withdrawal = {
  id: string;
  userId: string;
  amount: number;
  currency: "USD";
  status: "pending" | "approved" | "rejected" | "transferred";
  accountLast4: string;
  stripeConnectAccountId?: string;
  stripeTransferId?: string;
  adminNote?: string;
  createdAt: string;
  updatedAt: string;
};

export type LoginCode = {
  email: string;
  codeHash: string;
  expiresAt: string;
  createdAt: string;
};

export type Database = {
  users: User[];
  bookings: Booking[];
  orders: Order[];
  walletAccounts?: WalletAccount[];
  walletTransactions?: WalletTransaction[];
  withdrawals?: Withdrawal[];
  loginCodes?: LoginCode[];
};
