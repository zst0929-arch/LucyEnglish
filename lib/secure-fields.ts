import crypto from "crypto";

const fallbackSecret = "lucy-chinese-studio-dev-secret";

function encryptionKey() {
  return crypto.createHash("sha256").update(process.env.ACCOUNT_ENCRYPTION_KEY || process.env.AUTH_SECRET || fallbackSecret).digest();
}

export function encryptField(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", encryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64url"), tag.toString("base64url"), encrypted.toString("base64url")].join(".");
}

export function decryptField(payload: string) {
  const [ivText, tagText, encryptedText] = payload.split(".");
  if (!ivText || !tagText || !encryptedText) return "";
  const decipher = crypto.createDecipheriv("aes-256-gcm", encryptionKey(), Buffer.from(ivText, "base64url"));
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedText, "base64url")), decipher.final()]).toString("utf8");
}

export function accountLast4(value: string) {
  const compact = value.replace(/\s+/g, "");
  return compact.slice(-4) || "****";
}
