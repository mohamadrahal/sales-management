// app/api/contracts/[id]/download.ts
import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join } from "path";
import prisma from "../../../../../../prisma/client";
import mime from "mime";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);

  if (!id) {
    return NextResponse.json({ error: "Invalid contract ID" }, { status: 400 });
  }

  try {
    // Fetch the contract to get the document path
    const contract = await prisma.contract.findUnique({
      where: { id },
      select: { documentPath: true, companyName: true },
    });

    if (!contract || !contract.documentPath) {
      return NextResponse.json(
        { error: "Contract or document not found" },
        { status: 404 }
      );
    }

    const filePath = join(process.cwd(), "public", contract.documentPath);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const mimeType = mime.getType(filePath) || "application/octet-stream";
    const fileExtension = filePath.split(".").pop(); // Extract the file extension from the file path

    console.log(`MIME Type: ${mimeType}`);
    console.log(`File Extension: ${fileExtension}`);

    const stream = createReadStream(filePath);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${contract.companyName}_contract.${fileExtension}"`,
      },
    });
  } catch (error) {
    console.error("Failed to download contract file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
