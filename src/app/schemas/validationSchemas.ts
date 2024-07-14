import { z } from "zod";
import { TargetType } from "@prisma/client";

const isDateBefore = (date: string, referenceDate: Date) => {
  const targetDate = new Date(date);
  return targetDate < referenceDate;
};

const isDateAfter = (date: string, referenceDate: Date) => {
  const targetDate = new Date(date);
  return targetDate > referenceDate;
};

const TargetSchema = z
  .object({
    targetType: z.nativeEnum(TargetType),
    targetOwnerId: z.number().positive("Owner ID must be a positive number"),
    periodFrom: z.string().refine((date) => isDateBefore(date, new Date()), {
      message: "Period From should be before the current date.",
    }),
    periodTo: z.string(),
    numberOfContracts: z
      .number()
      .nonnegative("Number of Contracts must be non-negative"),
    totalAmountLYD: z
      .number()
      .nonnegative("Total Amount (LYD) must be non-negative")
      .optional(),
    amountPerContract: z
      .number()
      .nonnegative("Amount per Contract must be non-negative")
      .optional(),
    bonusAmount: z.number().optional().nullable(),
  })
  .refine((data) => isDateAfter(data.periodTo, new Date(data.periodFrom)), {
    message: "Period To should be after the Period From date.",
  })
  .superRefine((data, ctx) => {
    if (data.targetType === TargetType.Salesman) {
      if (data.amountPerContract === undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["amountPerContract"],
          message: "Amount per Contract is required for Salesman targets.",
        });
      }
      if (
        data.amountPerContract !== undefined &&
        data.totalAmountLYD !== undefined &&
        data.totalAmountLYD !== data.amountPerContract * data.numberOfContracts
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["totalAmountLYD"],
          message:
            "Total Amount (LYD) should be calculated as amountPerContract * numberOfContracts for Salesman targets.",
        });
      }
    }
    if (
      data.targetType === TargetType.Team &&
      data.totalAmountLYD === undefined
    ) {
      ctx.addIssue({
        code: "custom",
        path: ["totalAmountLYD"],
        message: "Total Amount (LYD) is required for Team targets.",
      });
    }
  });

export default TargetSchema;
