import type { RsvpErrorCode, RsvpInput } from "./types";

export interface NormalizedRsvp {
  status: RsvpInput["status"];
  giftIds: string[];
  message: string | null;
}

export type RuleViolation = { code: RsvpErrorCode; message: string };

const clean = (s: string) => s.replace(/\s+/g, " ").trim();

export function normalizeAndValidate(
  input: RsvpInput,
  maxGiftsPerGuest: number | null,
): { ok: true; value: NormalizedRsvp } | { ok: false; error: RuleViolation } {
  const giftIds =
    input.status === "DECLINED" ? [] : Array.from(new Set(input.giftIds));
  if (maxGiftsPerGuest !== null && giftIds.length > maxGiftsPerGuest) {
    return {
      ok: false,
      error: {
        code: "GIFT_LIMIT",
        message: `Você pode escolher até ${maxGiftsPerGuest} presente${maxGiftsPerGuest > 1 ? "s" : ""}.`,
      },
    };
  }

  const message = input.message ? clean(input.message).slice(0, 500) : "";
  return {
    ok: true,
    value: {
      status: input.status,
      giftIds,
      message: message || null,
    },
  };
}
