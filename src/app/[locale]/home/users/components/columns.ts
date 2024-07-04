// src/app/home/users/columns.ts
import { User, Team } from "@prisma/client";
import { useTranslations } from "next-intl";

type TranslationFunction = (key: string) => string;

export const getUsersColumns = (t: TranslationFunction) => [
  { header: t("id"), accessor: "id" },
  { header: t("role"), accessor: "role" },
  { header: t("username"), accessor: "username" },
  { header: t("name"), accessor: "name" },
  { header: t("bcd"), accessor: "bcdAccount" },
  { header: t("evo"), accessor: "evoAppId" },
  {
    header: t("team"),
    accessor: (row: User & { team: Team | null; managedTeams: Team[] }) =>
      row.role === "SalesManager"
        ? row.managedTeams.map((team) => team.name).join(", ")
        : row.team?.name || "No Team",
  },
];
