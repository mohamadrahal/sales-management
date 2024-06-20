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
  name: z.string().min(1, "Team name is required"),
  location: cityEnum,
});

export type City = z.infer<typeof cityEnum>;
