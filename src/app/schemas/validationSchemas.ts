// schemas/targetSchema.ts
import { z } from "zod";

export const TargetSchema = z.object({
  targetOwnerId: z.number().int(),
  periodFrom: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  periodTo: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Invalid date format",
    }),
  targetType: z.enum(["Team", "Salesman"]),
  numberOfContracts: z
    .number()
    .int()
    .min(1, { message: "Must be at least 1 contract" }),
  totalAmountLYD: z
    .number()
    .min(0, { message: "Total amount must be positive" }),
  bonusAmount: z.number().optional(),
});
