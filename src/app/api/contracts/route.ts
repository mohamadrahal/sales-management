import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../prisma/client";
import mime from "mime";
import { join } from "path";
import { stat, mkdir, writeFile } from "fs/promises";
import { BusinessType, ContractType } from "@prisma/client";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.NEXT_PUBLIC_JWT_SECRET || "your_secret_key";

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export async function POST(req: NextRequest) {
  const token = req.headers.get("Authorization")?.split(" ")[1];

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const decoded = verifyToken(token);

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  console.log(decoded);

  const { userId: salesmanId } = decoded as { userId: number };

  console.log(salesmanId);

  if (!salesmanId) {
    console.error("Salesman ID is missing from the token.");
    return NextResponse.json(
      { error: "Salesman ID is missing." },
      { status: 400 }
    );
  }

  const formData = await req.formData();

  const type = formData.get("type") as ContractType;
  const companyName = formData.get("companyName") as string;
  const businessType = formData.get("businessType") as BusinessType;
  const ownerName = formData.get("ownerName") as string;
  const ownerMobileNumber = formData.get("ownerMobileNumber") as string;
  const companyMobileNumber = formData.get("companyMobileNumber") as string;
  const contactPersonName = formData.get("contactPersonName") as string;
  const contactPersonMobileNumber = formData.get(
    "contactPersonMobileNumber"
  ) as string;
  const bcdAccountNumber = formData.get("bcdAccountNumber") as string;
  const document = formData.get("document") as File | null;

  if (!document) {
    return NextResponse.json(
      { error: "Document file is required." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await document.arrayBuffer());
  const relativeUploadDir = `/uploads/${new Date(Date.now())
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, "-")}`;

  const uploadDir = join(process.cwd(), "public", relativeUploadDir);

  try {
    await stat(uploadDir);
  } catch (e: any) {
    if (e.code === "ENOENT") {
      try {
        await mkdir(uploadDir, { recursive: true });
      } catch (mkdirError) {
        console.error("Error creating upload directory:", mkdirError);
        return NextResponse.json(
          { error: "Failed to create upload directory." },
          { status: 500 }
        );
      }
    } else {
      console.error("Error checking upload directory:", e);
      return NextResponse.json(
        { error: "Something went wrong." },
        { status: 500 }
      );
    }
  }

  try {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${document.name.replace(
      /\.[^/.]+$/,
      ""
    )}-${uniqueSuffix}.${mime.getExtension(document.type)}`;
    await writeFile(`${uploadDir}/${filename}`, buffer);
    const fileUrl = `${relativeUploadDir}/${filename}`;

    const newContract = await prisma.contract.create({
      data: {
        salesmanId,
        type,
        companyName,
        businessType,
        ownerName,
        ownerMobileNumber,
        companyMobileNumber,
        contactPersonName,
        contactPersonMobileNumber,
        bcdAccountNumber,
        documentPath: fileUrl,
        status: "Pending",
      },
    });

    return NextResponse.json(newContract, { status: 201 });
  } catch (e) {
    console.error(
      "Error while trying to upload a file or create a contract:",
      e
    );
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}

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
    let contracts, totalCount;

    if (role === "Admin") {
      [contracts, totalCount] = await Promise.all([
        prisma.contract.findMany({
          skip: offset,
          take: limit,
          include: {
            salesman: true,
          },
        }),
        prisma.contract.count(),
      ]);
    } else if (role === "SalesManager") {
      const managedTeamIds = await prisma.team.findMany({
        where: { managerId: userId },
        select: { id: true },
      });

      const teamIds = managedTeamIds.map((team) => team.id);

      [contracts, totalCount] = await Promise.all([
        prisma.contract.findMany({
          where: {
            salesman: {
              teamId: { in: teamIds },
            },
          },
          skip: offset,
          take: limit,
          include: {
            salesman: true,
          },
        }),
        prisma.contract.count({
          where: {
            salesman: {
              teamId: { in: teamIds },
            },
          },
        }),
      ]);
    } else if (role === "Salesman") {
      [contracts, totalCount] = await Promise.all([
        prisma.contract.findMany({
          where: { salesmanId: userId },
          skip: offset,
          take: limit,
          include: {
            salesman: true,
          },
        }),
        prisma.contract.count({ where: { salesmanId: userId } }),
      ]);

      console.log(userId);
    } else {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json({ contracts, totalCount }, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch contracts:", error);
    return NextResponse.json(
      { error: "Failed to fetch contracts" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
