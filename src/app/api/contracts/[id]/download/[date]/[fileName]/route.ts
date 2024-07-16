import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync } from "fs";
import { join } from "path";
import mime from "mime";

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string; fileName: string } }
) {
  const { date, fileName } = params;

  if (!date || !fileName) {
    return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
  }

  try {
    const filePath = join(process.cwd(), "public", "uploads", date, fileName);

    console.log(filePath);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const mimeType = mime.getType(filePath) || "application/octet-stream";
    const stream = createReadStream(filePath);

    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": mimeType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Failed to download file:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
