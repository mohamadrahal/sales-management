// lib/schemas.js
import { z } from "zod";

export const userSchema = z.object({
  role: z.enum(["Admin", "SalesManager", "Salesman"]),
  username: z.string().min(1),
  password: z.string().min(6),
  teamId: z.number().optional(),
  name: z.string().min(1),
  mobileNumber: z.string().min(10),
  bcdAccount: z.string().optional(),
  evoAppId: z.string().min(1),
  nationalId: z.string().min(1),
});

export const userUpdateSchema = userSchema.partial();
