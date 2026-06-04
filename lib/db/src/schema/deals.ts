import { z } from "zod/v4";

export const insertDealSchema = z.object({
  dealId: z.string(),
  sellerId: z.string(),
  buyerId: z.string().optional(),
  title: z.string(),
  price: z.string(),
  currency: z.string(),
  status: z.string().default("active"),
});

export type InsertDeal = z.infer<typeof insertDealSchema>;

export interface Deal {
  dealId: string;
  sellerId: string;
  buyerId?: string;
  title: string;
  price: string;
  currency: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}
