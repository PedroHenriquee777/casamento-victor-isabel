import type { ComponentType } from "react";
import type { InviteKind } from "@/lib/types";
import { CountdownPage } from "./CountdownPage";
import { DatePage } from "./DatePage";
import { GuidancePage, InfoPage } from "./InfoPages";
import { MessagePage } from "./MessagePage";
import { NamesPage } from "./NamesPage";
import { RsvpPage } from "./RsvpPage";
import { VenuePage } from "./VenuePage";

export type PageKey = "names" | "message" | "date" | "venue" | "countdown" | "info" | "guidance" | "rsvp";

export function pagesFor(kind: InviteKind): PageKey[] {
  return kind === "GODPARENT"
    ? ["names", "message", "date", "venue", "countdown", "info", "guidance", "rsvp"]
    : ["names", "message", "date", "venue", "countdown", "info", "rsvp"];
}

export const PAGE_COMPONENTS: Record<PageKey, ComponentType> = {
  names: NamesPage,
  message: MessagePage,
  date: DatePage,
  venue: VenuePage,
  countdown: CountdownPage,
  info: InfoPage,
  guidance: GuidancePage,
  rsvp: RsvpPage,
};

export const PAGE_LABELS: Record<PageKey, string> = {
  names: "Os noivos",
  message: "Mensagem",
  date: "Data do casamento",
  venue: "Local",
  countdown: "Contagem regressiva",
  info: "Informações importantes",
  guidance: "Orientações para padrinhos",
  rsvp: "Confirmação de presença",
};
