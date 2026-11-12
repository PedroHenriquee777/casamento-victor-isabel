"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { InvitePayload, RsvpResult, RsvpStatus } from "@/lib/types";
import { BOOK_LEAVE_FALLBACK_MS } from "../book/timing";

export type RsvpStep = "presence" | "gifts" | "thanks";

export function useRsvpFlow(
  data: InvitePayload,
  setData: (p: InvitePayload) => void,
) {
  const { guest, gifts, wedding } = data;
  const existing = guest.rsvp;

  const [step, setStep] = useState<RsvpStep>(existing ? "thanks" : "presence");
  const [status, setStatus] = useState<RsvpStatus | null>(
    existing?.status ?? null,
  );
  const [giftIds, setGiftIds] = useState<string[]>(() =>
    gifts.filter((g) => g.reservedByMe).map((g) => g.id),
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limitHit, setLimitHit] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const max = wedding.maxGiftsPerGuest;

  const availableIds = useMemo(
    () => new Set(gifts.filter((g) => g.available).map((g) => g.id)),
    [gifts],
  );
  const selected = useMemo(
    () => giftIds.filter((id) => availableIds.has(id)),
    [giftIds, availableIds],
  );

  const choose = useCallback((s: RsvpStatus) => {
    setStatus(s);
    setError(null);
  }, []);

  const toggleGift = useCallback(
    (id: string) => {
      setLimitHit(false);
      setError(null);
      setGiftIds((prev) => {
        if (prev.includes(id)) return prev.filter((x) => x !== id);
        const count = prev.filter((x) => availableIds.has(x)).length;
        if (max !== null && count >= max) {
          setLimitHit(true);
          return prev;
        }
        return [...prev, id];
      });
    },
    [availableIds, max],
  );

  const pendingStep = useRef<RsvpStep | null>(null);
  const leaveTimer = useRef<number | undefined>(undefined);
  const finishLeave = useCallback(() => {
    window.clearTimeout(leaveTimer.current);
    const to = pendingStep.current;
    if (!to) return;
    pendingStep.current = null;
    setStep(to);
    setLeaving(false);
  }, []);
  const leaveBook = useCallback(
    (to: RsvpStep) => {
      pendingStep.current = to;
      setLeaving(true);
      window.clearTimeout(leaveTimer.current);
      leaveTimer.current = window.setTimeout(
        finishLeave,
        BOOK_LEAVE_FALLBACK_MS,
      );
    },
    [finishLeave],
  );
  useEffect(() => () => window.clearTimeout(leaveTimer.current), []);

  useEffect(() => {
    if (!limitHit) return;
    const t = window.setTimeout(() => setLimitHit(false), 4500);
    return () => window.clearTimeout(t);
  }, [limitHit]);

  const next = useCallback(() => {
    setError(null);
    if (step === "presence" && status) setStep("gifts");
  }, [step, status]);

  const back = useCallback(() => {
    setError(null);
    setLimitHit(false);
    if (step === "gifts") leaveBook("presence");
  }, [step, leaveBook]);

  const edit = useCallback(() => {
    setError(null);
    setStep("presence");
  }, []);

  const submit = useCallback(async () => {
    if (!status) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: guest.token,
          status,
          giftIds: status === "DECLINED" ? [] : selected,
        }),
      });
      const json = (await res.json()) as RsvpResult;
      if (json.ok) {
        setData(json.payload);
        setGiftIds(
          json.payload.gifts.filter((g) => g.reservedByMe).map((g) => g.id),
        );
        if (step === "gifts") leaveBook("thanks");
        else setStep("thanks");
      } else {
        if (json.payload) setData(json.payload);
        if (json.code === "GIFT_UNAVAILABLE") {
          const gone = new Set(json.unavailableGiftIds ?? []);
          setGiftIds((prev) => prev.filter((id) => !gone.has(id)));
          setStep("gifts");
        }
        setError(json.message);
      }
    } catch {
      setError("Sem conexão. Verifique a internet e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  }, [status, step, selected, guest.token, setData, leaveBook]);

  return {
    step,
    status,
    selected,
    max,
    submitting,
    error,
    limitHit,
    leaving,
    finishLeave,
    navLocked: step === "gifts" || submitting,
    choose,
    toggleGift,
    next,
    back,
    edit,
    submit,
  };
}

export type RsvpFlow = ReturnType<typeof useRsvpFlow>;
