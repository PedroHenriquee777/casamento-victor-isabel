export type InviteKind = "GUEST" | "GODPARENT";
export type GodparentRole = "PADRINHO" | "MADRINHA";
export type RsvpStatus = "CONFIRMED" | "DECLINED";

export interface InfoItem {
  icon:
    | "dress"
    | "clock"
    | "car"
    | "heart"
    | "camera"
    | "gift"
    | "champagne"
    | "sun";
  title: string;
  text: string;
}

export interface ScheduleItem {
  time: string;
  label: string;
}

export interface WeddingContent {
  tagline: string;
  message: string[];
  signature: string;
  countdownLine: string;
  venue: {
    name: string;
    address: string;
    city: string;
    lat?: number;
    lng?: number;
    mapsUrl?: string;
    mapMode: "illustrated" | "embed";
    streetLabel?: string;
    marker?: "church" | "pin";
    note?: string;
  };
  schedule: ScheduleItem[];
  info: InfoItem[];
  godparents: {
    tagline: string;
    greeting: string;
    message: string[];
    question: string;
    closing: string;
    guidance: InfoItem[];
    dressCode: { PADRINHO: string; MADRINHA: string };
    arrival: string;
  };
  rsvp: {
    deadlineLabel?: string;
    thanksConfirmed: string;
    thanksDeclined: string;
  };
}

export interface WeddingView {
  groomName: string;
  brideName: string;
  eventAt: string;
  timeZone: string;
  maxGiftsPerGuest: number | null;
  content: WeddingContent;
}

export interface RsvpView {
  status: RsvpStatus;
  message?: string | null;
}

export interface GuestView {
  id: string;
  token: string;
  name: string;
  kind: InviteKind;
  godparentRole: GodparentRole | null;
  rsvp: RsvpView | null;
}

export interface GiftView {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  priceCents: number | null;
  quantity: number;
  remaining: number;
  available: boolean;
  reservedByMe: boolean;
}

export interface InvitePayload {
  wedding: WeddingView;
  guest: GuestView;
  gifts: GiftView[];
}

export interface RsvpInput {
  token: string;
  status: RsvpStatus;
  giftIds: string[];
  message?: string;
}

export type RsvpErrorCode =
  | "INVALID_TOKEN"
  | "GIFT_UNAVAILABLE"
  | "GIFT_LIMIT"
  | "UNKNOWN";

export type RsvpResult =
  | { ok: true; payload: InvitePayload }
  | {
      ok: false;
      code: RsvpErrorCode;
      message: string;
      unavailableGiftIds?: string[];
      payload?: InvitePayload;
    };

export interface AdminGuestRow {
  id: string;
  name: string;
  kind: InviteKind;
  godparentRole: GodparentRole | null;
  status: RsvpStatus | null;
  respondedAt: string | null;
  gifts: { id: string; name: string }[];
}

export interface AdminGiftRow {
  id: string;
  name: string;
  category: string;
  quantity: number;
  takenBy: string[];
}

export interface AdminOverview {
  couple: string;
  generatedAt: string;
  maxGiftsPerGuest: number | null;
  guests: AdminGuestRow[];
  gifts: AdminGiftRow[];
}
