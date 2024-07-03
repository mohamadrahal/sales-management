// src/app/api/reports/compensation.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../../prisma/client";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const reportType = url.searchParams.get("reportType");
  const filterType = url.searchParams.get("filterType");
  const filterValue = url.searchParams.get("filterValue");

  try {
    const filters: { [key: string]: any } = {};

    if (reportType) {
      filters.type = reportType;
    }

    if (filterType && filterValue) {
      switch (filterType) {
        case "period":
          filters.period = filterValue;
          break;
        case "team":
          filters.team = {
            name: filterValue,
          };
          break;
        case "salesman":
          filters.salesman = {
            name: filterValue,
          };
          break;
        default:
          break;
      }
    }

    const reports = await prisma.compensationReport.findMany({
      where: filters,
      include: {
        team: true,
        salesman: true,
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch compensation reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch compensation reports" },
      { status: 500 }
    );
  }
}
