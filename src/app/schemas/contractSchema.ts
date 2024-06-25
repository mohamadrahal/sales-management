import { z } from "zod";

export const contractSchema = z.object({
  salesmanId: z.number().int(),
  type: z.enum(["Subagent", "Merchant", "Both"]),
  companyName: z.string(),
  businessType: z.enum([
    "Retail",
    "Wholesale",
    "FoodService",
    "Manufacturing",
    "Technology",
    "Healthcare",
    "FinancialServices",
    "RealEstate",
    "Education",
    "Transportation",
    "Entertainment",
    "NonProfit",
  ]),
  ownerName: z.string(),
  ownerMobileNumber: z.string(),
  companyMobileNumber: z.string(),
  contactPersonName: z.string(),
  contactPersonMobileNumber: z.string(),
  bcdAccountNumber: z.string().optional(),
  documentPath: z.string(),
});
