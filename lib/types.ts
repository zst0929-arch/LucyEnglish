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
  nationality: string;
  stage: string;
  chineseLevel: string;
  date: string;
  message: string;
  status: "pending" | "confirmed";
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  amount: number;
  currency: "USD";
  status: "paid" | "pending";
  createdAt: string;
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
  loginCodes?: LoginCode[];
};
