import crypto from "crypto";
import type { User } from "./types";

const secret = process.env.AUTH_SECRET || "lucy-chinese-studio-dev-secret";
const adminTokenPrefix = "lucy-admin";

function signPayload(payload: string, scope = "user") {
  return crypto.createHmac("sha256", `${scope}:${secret}`).update(payload).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  if (leftBuffer.length !== rightBuffer.length) return false;
  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, passwordHash: string) {
  const [salt, hash] = passwordHash.split(":");
  if (!salt || !hash) return false;
  const candidate = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(candidate, "hex"));
}

export function createToken(user: Pick<User, "id" | "email" | "name">) {
  const payload = Buffer.from(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      name: user.name,
      exp: Date.now() + 1000 * 60 * 60 * 24 * 7
    })
  ).toString("base64url");
  const signature = signPayload(payload);
  return `${payload}.${signature}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return null;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = signPayload(payload);
    if (!safeEqual(signature, expected)) return null;

    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      sub: string;
      email: string;
      name: string;
      exp: number;
    };

    if (parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function adminCredentialsConfigured() {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD);
}

export function verifyAdminCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  if (!adminEmail || !adminPassword) return false;
  return email.trim().toLowerCase() === adminEmail && safeEqual(password, adminPassword);
}

export function createAdminToken(email: string) {
  const payload = Buffer.from(
    JSON.stringify({
      scope: adminTokenPrefix,
      email: email.trim().toLowerCase(),
      exp: Date.now() + 1000 * 60 * 60 * 8
    })
  ).toString("base64url");
  const signature = signPayload(payload, "admin");
  return `${payload}.${signature}`;
}

export function verifyAdminToken(token?: string | null) {
  if (!token) return null;
  try {
    const [payload, signature] = token.split(".");
    if (!payload || !signature) return null;
    const expected = signPayload(payload, "admin");
    if (!safeEqual(signature, expected)) return null;

    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      scope: string;
      email: string;
      exp: number;
    };

    if (parsed.scope !== adminTokenPrefix || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function tokenFromRequest(request: Request) {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}
