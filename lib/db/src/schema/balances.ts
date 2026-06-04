import { z } from "zod/v4";

export const insertBalanceSchema = z.object({
  userId: z.string(),
  hrn: z.string().default("0"),
  rub: z.string().default("0"),
  ton: z.string().default("0"),
  stars: z.string().default("0"),
});

export type InsertBalance = z.infer<typeof insertBalanceSchema>;

export interface Balance {
  userId: string;
  hrn: string;
  rub: string;
  ton: string;
  stars: string;
  createdAt: string;
  updatedAt: string;
}
