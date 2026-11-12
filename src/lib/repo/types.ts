import type { AdminOverview, InvitePayload, RsvpInput, RsvpResult } from "../types";

export interface InviteRepo {
  getInvite(token: string): Promise<InvitePayload | null>;
  submitRsvp(input: RsvpInput): Promise<RsvpResult>;
  getAdminOverview(): Promise<AdminOverview>;
}
