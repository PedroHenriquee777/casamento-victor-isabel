import type { Prisma } from "@/generated/prisma/client";
import { getPrisma } from "../prisma-client";
import { normalizeAndValidate } from "../rsvp-rules";
import type {
  AdminOverview,
  GiftView,
  GuestView,
  InvitePayload,
  RsvpInput,
  RsvpResult,
  WeddingContent,
  WeddingView,
} from "../types";
import type { InviteRepo } from "./types";

const WEDDING_ID = "main";

class GiftUnavailableError extends Error {
  constructor(public giftIds: string[]) {
    super("GIFT_UNAVAILABLE");
  }
}

const errCode = (e: unknown): string | undefined =>
  typeof e === "object" && e !== null && "code" in e ? String((e as { code: unknown }).code) : undefined;

const isConnectionClosed = (e: unknown) =>
  errCode(e) === "P1017" ||
  /closed the connection|connection terminated|terminating connection|ECONNRESET|ETIMEDOUT|socket hang up|Code: `(57P0[123]|08006|08003|08001)`/i.test(e instanceof Error ? e.message : String(e));

async function withRetry<T>(fn: () => Promise<T>, tries = 3): Promise<T> {
  for (let i = 0; ; i++) {
    try {
      return await fn();
    } catch (e) {
      if (i >= tries - 1 || !isConnectionClosed(e)) throw e;
      console.warn(`[db] conexão caiu, tentando de novo (${i + 1}/${tries - 1})…`);
      await new Promise((r) => setTimeout(r, 200 * (i + 1)));
    }
  }
}


const buildPayload = (token: string, db: Prisma.TransactionClient | ReturnType<typeof getPrisma>) =>
  withRetry(() => buildPayloadOnce(token, db));

async function buildPayloadOnce(token: string, db: Prisma.TransactionClient | ReturnType<typeof getPrisma>) {
  const guest = await db.guest.findUnique({ where: { token }, include: { rsvp: true } });
  if (!guest) return null;

  const wedding = await db.wedding.findUniqueOrThrow({ where: { id: guest.weddingId } });
  const gifts = await db.gift.findMany({ where: { weddingId: guest.weddingId, active: true }, orderBy: { sortOrder: "asc" } });
  const reservations = await db.giftReservation.findMany({
    where: { gift: { weddingId: guest.weddingId } },
    select: { giftId: true, guestId: true },
  });

  const counts = new Map<string, number>();
  const mine = new Set<string>();
  for (const r of reservations) {
    counts.set(r.giftId, (counts.get(r.giftId) ?? 0) + 1);
    if (r.guestId === guest.id) mine.add(r.giftId);
  }

  const giftViews: GiftView[] = gifts.map((gift) => {
    const quantity = gift.quantity ?? 1;
    const remaining = Math.max(0, quantity - (counts.get(gift.id) ?? 0));
    const reservedByMe = mine.has(gift.id);
    return {
      id: gift.id,
      name: gift.name,
      category: gift.category,
      description: gift.description,
      imageUrl: gift.imageUrl,
      priceCents: gift.priceCents,
      quantity,
      remaining,
      available: remaining > 0 || reservedByMe,
      reservedByMe,
    };
  });

  const weddingView: WeddingView = {
    groomName: wedding.groomName,
    brideName: wedding.brideName,
    eventAt: wedding.eventAt.toISOString(),
    timeZone: wedding.timeZone,
    maxGiftsPerGuest: wedding.maxGiftsPerGuest,
    content: wedding.content as unknown as WeddingContent,
  };

  const guestView: GuestView = {
    id: guest.id,
    token: guest.token,
    name: guest.name,
    kind: guest.kind,
    godparentRole: guest.godparentRole,
    rsvp: guest.rsvp ? { status: guest.rsvp.status, message: guest.rsvp.message } : null,
  };

  return { wedding: weddingView, guest: guestView, gifts: giftViews } satisfies InvitePayload;
}


export const prismaRepo: InviteRepo = {
  async getInvite(token) {
    const prisma = getPrisma();
    const payload = await buildPayload(token, prisma);
    if (payload) {
      prisma.guest
        .updateMany({ where: { token, openedAt: null }, data: { openedAt: new Date() } })
        .catch(() => undefined);
    }
    return payload;
  },

  async submitRsvp(input: RsvpInput): Promise<RsvpResult> {
    const prisma = getPrisma();
    const guest = await withRetry(() =>
      prisma.guest.findUnique({
        where: { token: input.token },
        include: { wedding: { select: { maxGiftsPerGuest: true } } },
      }),
    );
    if (!guest) return { ok: false, code: "INVALID_TOKEN", message: "Convite não encontrado." };

    const checked = normalizeAndValidate(input, guest.wedding.maxGiftsPerGuest);
    if (!checked.ok) {
      return { ok: false, ...checked.error, payload: (await buildPayload(input.token, prisma)) ?? undefined };
    }
    const { status, giftIds, message } = checked.value;

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        await prisma.$transaction(
          async (tx) => {
            await tx.rsvp.upsert({
              where: { guestId: guest.id },
              create: { guestId: guest.id, status, message },
              update: { status, message, respondedAt: new Date() },
            });

            const current = await tx.giftReservation.findMany({ where: { guestId: guest.id } });
            const currentIds = new Set(current.map((r) => r.giftId));
            const wanted = new Set(giftIds);

            const toRemove = current.filter((r) => !wanted.has(r.giftId)).map((r) => r.id);
            if (toRemove.length) await tx.giftReservation.deleteMany({ where: { id: { in: toRemove } } });

            const toAdd = giftIds.filter((id) => !currentIds.has(id));
            const unavailable: string[] = [];
            for (const giftId of toAdd) {
              const gift = await tx.gift.findFirst({
                where: { id: giftId, weddingId: guest.weddingId, active: true },
              });
              if (!gift) {
                unavailable.push(giftId);
                continue;
              }
              const quantity = gift.quantity ?? 1;
              const rows = await tx.giftReservation.findMany({ where: { giftId }, select: { slotKey: true } });
              if (rows.length >= quantity) {
                unavailable.push(giftId);
                continue;
              }
              const used = new Set(rows.map((r) => r.slotKey));
              let slot = 0;
              while (used.has(`${giftId}#${slot}`)) slot++;
              await tx.giftReservation.create({ data: { giftId, guestId: guest.id, slotKey: `${giftId}#${slot}` } });
            }
            if (unavailable.length) throw new GiftUnavailableError(unavailable);
          },
          { isolationLevel: "Serializable", timeout: 10_000 },
        );
        break;
      } catch (e) {
        if (e instanceof GiftUnavailableError) {
          return {
            ok: false,
            code: "GIFT_UNAVAILABLE",
            message: "Alguém acabou de reservar um dos presentes escolhidos. Atualizamos a lista para você.",
            unavailableGiftIds: e.giftIds,
            payload: (await buildPayload(input.token, prisma)) ?? undefined,
          };
        }
        if ((errCode(e) === "P2034" || errCode(e) === "P2002" || isConnectionClosed(e)) && attempt < 2) continue;
        console.error("[rsvp] erro ao gravar", e);
        return { ok: false, code: "UNKNOWN", message: "Não foi possível salvar agora. Tente novamente." };
      }
    }

    const payload = await buildPayload(input.token, prisma);
    if (!payload) return { ok: false, code: "UNKNOWN", message: "Não foi possível salvar agora." };
    return { ok: true, payload };
  },

  getAdminOverview(): Promise<AdminOverview> {
    return withRetry(async () => {
      const db = getPrisma();
      const wedding = await db.wedding.findUniqueOrThrow({ where: { id: WEDDING_ID } });
      const gifts = await db.gift.findMany({ where: { weddingId: WEDDING_ID, active: true }, orderBy: { sortOrder: "asc" } });
      const guests = await db.guest.findMany({
        where: { weddingId: WEDDING_ID },
        orderBy: { name: "asc" },
        include: { rsvp: true, reservations: { select: { giftId: true } } },
      });

      const giftName = new Map(gifts.map((gf) => [gf.id, gf.name]));
      const order = new Map(gifts.map((gf, i) => [gf.id, i]));
      const takenBy = new Map<string, string[]>();
      for (const gu of guests) {
        for (const r of gu.reservations) takenBy.set(r.giftId, [...(takenBy.get(r.giftId) ?? []), gu.name]);
      }

      return {
        couple: `${wedding.groomName} & ${wedding.brideName}`,
        generatedAt: new Date().toISOString(),
        maxGiftsPerGuest: wedding.maxGiftsPerGuest,
        guests: guests.map((gu) => ({
          id: gu.id,
          name: gu.name,
          kind: gu.kind,
          godparentRole: gu.godparentRole,
          status: gu.rsvp?.status ?? null,
          respondedAt: gu.rsvp?.respondedAt.toISOString() ?? null,
          gifts: gu.reservations
            .filter((r) => giftName.has(r.giftId))
            .sort((a, b) => (order.get(a.giftId) ?? 0) - (order.get(b.giftId) ?? 0))
            .map((r) => ({ id: r.giftId, name: giftName.get(r.giftId) ?? r.giftId })),
        })),
        gifts: gifts.map((gf) => ({
          id: gf.id,
          name: gf.name,
          category: gf.category,
          quantity: gf.quantity ?? 1,
          takenBy: takenBy.get(gf.id) ?? [],
        })),
      };
    });
  },
};

export { WEDDING_ID };
