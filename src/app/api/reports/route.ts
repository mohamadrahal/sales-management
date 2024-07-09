import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    return null;
  }
};

export async function GET(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { role, userId } = decoded as { role: string; userId: number };

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const offset = (page - 1) * limit;

  try {
    let reports, totalCount;

    if (role === "Admin") {
      [reports, totalCount] = await Promise.all([
        prisma.report.findMany({
          skip: offset,
          take: limit,
          include: {
            contractReports: {
              include: {
                contract: true,
              },
            },
            compensationReports: {
              include: {
                salesman: true,
                team: true,
              },
            },
          },
        }),
        prisma.report.count(),
      ]);
    } else if (role === "SalesManager") {
      const managedTeamIds = await prisma.team.findMany({
        where: { managerId: userId },
        select: { id: true },
      });

      const teamIds = managedTeamIds.map((team) => team.id);

      [reports, totalCount] = await Promise.all([
        prisma.report.findMany({
          where: {
            OR: [
              {
                compensationReports: {
                  some: {
                    teamId: { in: teamIds },
                  },
                },
              },
              {
                contractReports: {
                  some: {
                    contract: {
                      salesman: {
                        teamId: { in: teamIds },
                      },
                    },
                  },
                },
              },
            ],
          },
          skip: offset,
          take: limit,
          include: {
            contractReports: {
              include: {
                contract: true,
              },
            },
            compensationReports: {
              include: {
                salesman: true,
                team: true,
              },
            },
          },
        }),
        prisma.report.count({
          where: {
            OR: [
              {
                compensationReports: {
                  some: {
                    teamId: { in: teamIds },
                  },
                },
              },
              {
                contractReports: {
                  some: {
                    contract: {
                      salesman: {
                        teamId: { in: teamIds },
                      },
                    },
                  },
                },
              },
            ],
          },
        }),
      ]);
    } else if (role === "Salesman") {
      [reports, totalCount] = await Promise.all([
        prisma.report.findMany({
          where: {
            OR: [
              {
                compensationReports: {
                  some: {
                    salesmanId: userId,
                  },
                },
              },
              {
                contractReports: {
                  some: {
                    contract: {
                      salesmanId: userId,
                    },
                  },
                },
              },
            ],
          },
          skip: offset,
          take: limit,
          include: {
            contractReports: {
              include: {
                contract: true,
              },
            },
            compensationReports: {
              include: {
                salesman: true,
              },
            },
          },
        }),
        prisma.report.count({
          where: {
            OR: [
              {
                compensationReports: {
                  some: {
                    salesmanId: userId,
                  },
                },
              },
              {
                contractReports: {
                  some: {
                    contract: {
                      salesmanId: userId,
                    },
                  },
                },
              },
            ],
          },
        }),
      ]);

      console.log(userId);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ reports, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
