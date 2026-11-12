import { normalizeAndValidate } from "../rsvp-rules";
import type { AdminOverview, GiftView, GuestView, InvitePayload, RsvpInput, RsvpResult, WeddingView } from "../types";
import {
  DEMO_GUESTS,
  DEMO_PRE_RESERVED,
  GIFT_SEEDS,
  WEDDING_CONTENT,
  WEDDING_DEFAULTS,
  type DemoGuestSeed,
  type GiftSeed,
} from "../wedding-config";
import type { InviteRepo } from "./types";

interface MemRsvp {
  status: "CONFIRMED" | "DECLINED";
  message: string | null;
  respondedAt: string;
}

interface Store {
  guests: Map<string, DemoGuestSeed>;
  gifts: GiftSeed[];
  rsvps: Map<string, MemRsvp>;
  reservations: Set<string>;
}

const g = globalThis as unknown as { __conviteStore?: Store };

function createStore(): Store {
  return {
    guests: new Map(DEMO_GUESTS.map((x) => [x.token, { ...x }])),
    gifts: GIFT_SEEDS.map((x) => ({ ...x })),
    rsvps: new Map(),
    reservations: new Set(DEMO_PRE_RESERVED.map((r) => `${r.giftId}|${r.guestId}`)),
  };
}

const store = (g.__conviteStore ??= createStore());

function wedding(): WeddingView {
  return {
    groomName: WEDDING_DEFAULTS.groomName,
    brideName: WEDDING_DEFAULTS.brideName,
    eventAt: WEDDING_DEFAULTS.eventAt,
    timeZone: WEDDING_DEFAULTS.timeZone,
    maxGiftsPerGuest: WEDDING_DEFAULTS.maxGiftsPerGuest,
    content: WEDDING_CONTENT,
  };
}

const reservedCount = (giftId: string) =>
  [...store.reservations].filter((k) => k.startsWith(`${giftId}|`)).length;

function giftsFor(guestId: string): GiftView[] {
  return store.gifts
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((gift) => {
      const mine = store.reservations.has(`${gift.id}|${guestId}`);
      const taken = reservedCount(gift.id);
      const remaining = Math.max(0, gift.quantity - taken);
      return {
        id: gift.id,
        name: gift.name,
        category: gift.category,
        description: gift.description,
        imageUrl: gift.imageUrl,
        priceCents: gift.priceCents,
        quantity: gift.quantity,
        remaining,
        available: remaining > 0 || mine,
        reservedByMe: mine,
      };
    });
}

function guestView(seed: DemoGuestSeed): GuestView {
  const rsvp = store.rsvps.get(seed.id);
  return {
    id: seed.id,
    token: seed.token,
    name: seed.name,
    kind: seed.kind,
    godparentRole: seed.godparentRole,
    rsvp: rsvp ? { status: rsvp.status, message: rsvp.message } : null,
  };
}

function payloadFor(seed: DemoGuestSeed): InvitePayload {
  return { wedding: wedding(), guest: guestView(seed), gifts: giftsFor(seed.id) };
}

export const memoryRepo: InviteRepo = {
  async getInvite(token) {
    const seed = store.guests.get(token);
    return seed ? payloadFor(seed) : null;
  },

  async submitRsvp(input: RsvpInput): Promise<RsvpResult> {
    const seed = store.guests.get(input.token);
    if (!seed) return { ok: false, code: "INVALID_TOKEN", message: "Convite não encontrado." };

    const checked = normalizeAndValidate(input, WEDDING_DEFAULTS.maxGiftsPerGuest);
    if (!checked.ok) return { ok: false, ...checked.error, payload: payloadFor(seed) };
    const { status, giftIds, message } = checked.value;

    const available = new Map(giftsFor(seed.id).map((x) => [x.id, x.available]));
    const unavailable = giftIds.filter((id) => available.get(id) !== true);
    if (unavailable.length > 0) {
      return {
        ok: false,
        code: "GIFT_UNAVAILABLE",
        message: "Alguém acabou de reservar um dos presentes escolhidos. Atualizamos a lista para você.",
        unavailableGiftIds: unavailable,
        payload: payloadFor(seed),
      };
    }

    store.rsvps.set(seed.id, { status, message, respondedAt: new Date().toISOString() });
    for (const key of [...store.reservations]) {
      if (key.endsWith(`|${seed.id}`)) store.reservations.delete(key);
    }
    for (const id of giftIds) store.reservations.add(`${id}|${seed.id}`);

    return { ok: true, payload: payloadFor(seed) };
  },

  async getAdminOverview(): Promise<AdminOverview> {
    const gifts = store.gifts.slice().sort((a, b) => a.sortOrder - b.sortOrder);
    const giftName = new Map(gifts.map((x) => [x.id, x.name]));
    const guests = [...store.guests.values()];
    const nameOf = new Map(guests.map((x) => [x.id, x.name]));
    return {
      couple: `${WEDDING_DEFAULTS.groomName} & ${WEDDING_DEFAULTS.brideName}`,
      generatedAt: new Date().toISOString(),
      maxGiftsPerGuest: WEDDING_DEFAULTS.maxGiftsPerGuest,
      guests: guests.map((x) => {
        const rsvp = store.rsvps.get(x.id);
        return {
          id: x.id,
          name: x.name,
          kind: x.kind,
          godparentRole: x.godparentRole,
          status: rsvp?.status ?? null,
          respondedAt: rsvp?.respondedAt ?? null,
          gifts: gifts.filter((gf) => store.reservations.has(`${gf.id}|${x.id}`)).map((gf) => ({ id: gf.id, name: giftName.get(gf.id) ?? gf.id })),
        };
      }),
      gifts: gifts.map((gf) => ({
        id: gf.id,
        name: gf.name,
        category: gf.category,
        quantity: gf.quantity,
        takenBy: guests.filter((x) => store.reservations.has(`${gf.id}|${x.id}`)).map((x) => nameOf.get(x.id) ?? x.id),
      })),
    };
  },
};
