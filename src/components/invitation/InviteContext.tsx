"use client";

import { createContext, useContext } from "react";
import type { InvitePayload } from "@/lib/types";
import type { RsvpFlow } from "./useRsvpFlow";

export interface InviteCtx {
  data: InvitePayload;
  rsvp: RsvpFlow;
  close: () => void;
  refreshGifts: () => Promise<void>;
}

const Ctx = createContext<InviteCtx | null>(null);

export const InviteProvider = Ctx.Provider;

export function useInvite(): InviteCtx {
  const v = useContext(Ctx);
  if (!v) throw new Error("useInvite fora do InviteProvider");
  return v;
}
