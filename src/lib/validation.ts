import { z } from "zod";

export const rsvpBodySchema = z.object({
  token: z.string().min(3).max(64),
  status: z.enum(["CONFIRMED", "DECLINED"]),
  giftIds: z.array(z.string().min(1).max(64)).max(50).default([]),
  message: z.string().max(600).optional(),
});

export type RsvpBody = z.infer<typeof rsvpBodySchema>;
