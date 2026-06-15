import { randomInt } from "crypto";
import bcrypt from "bcryptjs";

export function generateCode(): string {
  return randomInt(100000, 999999).toString();
}

export async function hashCode(code: string): Promise<string> {
  return bcrypt.hash(code, 10);
}

export async function verifyCode(
  code: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(code, hash);
}
