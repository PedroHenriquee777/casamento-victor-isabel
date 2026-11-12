import { randomBytes } from "node:crypto";

export function newGuestToken(): string {
  return randomBytes(9).toString("base64url");
}
