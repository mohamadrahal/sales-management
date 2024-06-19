// lib/schemas.js
import { z } from "zod";

export const cityEnum = z.enum([
  "Tripoli",
  "Benghazi",
  "Misrata",
  "Bayda",
  "Zawiya",
  "Khoms",
  "Tobruk",
  "Ajdabiya",
  "Sebha",
  "Sirte",
  "Derna",
  "Zliten",
  "Sabratha",
  "Ghat",
  "Jalu",
]);

export const teamSchema = z.object({
  name: z.string().min(1),
  location: cityEnum,
});

export const teamUpdateSchema = teamSchema.partial();
