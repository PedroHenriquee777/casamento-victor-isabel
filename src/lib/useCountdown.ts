"use client";

import { useEffect, useState } from "react";

export interface Countdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  past: boolean;
  today: boolean;
}

export function useCountdown(targetIso: string, active = true): Countdown | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, [active]);

  if (now === null) return null;
  const diff = new Date(targetIso).getTime() - now;
  const abs = Math.abs(diff);
  const s = Math.floor(abs / 1000);
  return {
    days: Math.floor(s / 86400),
    hours: Math.floor((s % 86400) / 3600),
    minutes: Math.floor((s % 3600) / 60),
    seconds: s % 60,
    past: diff <= 0,
    today: abs < 86_400_000,
  };
}
