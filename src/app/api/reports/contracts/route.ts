// src/app/api/reports/contract.ts
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
        case "branch":
          filters.contract = {
            branches: {
              some: {
                name: filterValue,
              },
            },
          };
          break;
        case "branchCity":
          filters.contract = {
            branches: {
              some: {
                city: filterValue,
              },
            },
          };
          break;
        case "team":
          filters.contract = {
            salesman: {
              team: {
                name: filterValue,
              },
            },
          };
          break;
        case "salesman":
          filters.contract = {
            salesman: {
              name: filterValue,
            },
          };
          break;
        default:
          break;
      }
    }

    const reports = await prisma.contractReport.findMany({
      where: filters,
      include: {
        contract: {
          include: {
            branches: true,
            salesman: {
              include: {
                team: true,
              },
            },
          },
        },
      },
    });

    return NextResponse.json(reports);
  } catch (error) {
    console.error("Failed to fetch contract reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch contract reports" },
      { status: 500 }
    );
  }
}
