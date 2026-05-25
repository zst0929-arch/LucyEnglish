import { promises as fs } from "fs";
import path from "path";
import type { Database } from "./types";

const dbPath = path.join(process.cwd(), "data", "db.json");

const emptyDb: Database = {
  users: [],
  bookings: [],
  orders: [],
  walletAccounts: [],
  walletTransactions: [],
  withdrawals: [],
  loginCodes: []
};

export async function readDb(): Promise<Database> {
  try {
    const raw = await fs.readFile(dbPath, "utf8");
    const db = JSON.parse(raw) as Database;
    return {
      ...emptyDb,
      ...db,
      walletAccounts: db.walletAccounts || [],
      walletTransactions: db.walletTransactions || [],
      withdrawals: db.withdrawals || [],
      loginCodes: db.loginCodes || []
    };
  } catch {
    await writeDb(emptyDb);
    return emptyDb;
  }
}

export async function writeDb(db: Database) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  await fs.writeFile(dbPath, `${JSON.stringify(db, null, 2)}\n`, "utf8");
}

export function publicUser(user: { id: string; name: string; email: string; createdAt: string }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
  };
}
