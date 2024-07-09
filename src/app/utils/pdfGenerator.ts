import { Contract, Target, User } from "@prisma/client";
import { createWriteStream } from "fs";
import PDFDocument from "pdfkit";
import path from "path";

// Extend the Target type to include the individual property
interface ExtendedTarget extends Target {
  individual?: User;
}

export const generatePDF = async (
  contracts: Contract[],
  target: ExtendedTarget
) => {
  const doc = new PDFDocument();
  const pdfPath = path.join(
    process.cwd(),
    "public",
    `report-${Date.now()}.pdf`
  );
  const stream = createWriteStream(pdfPath);

  doc.pipe(stream);

  // Use built-in font "Times-Roman"
  doc
    .font("Times-Roman")
    .fontSize(25)
    .text("Compensation Report", { align: "center" });

  doc
    .font("Times-Roman")
    .fontSize(18)
    .text(`Salesman: ${target.individual?.name}`, { align: "left" });
  doc
    .font("Times-Roman")
    .fontSize(18)
    .text(`Target: ${target.numberOfContracts} contracts`, { align: "left" });
  doc
    .font("Times-Roman")
    .fontSize(18)
    .text(
      `Period: ${target.periodFrom.toDateString()} - ${target.periodTo.toDateString()}`,
      { align: "left" }
    );
  doc
    .font("Times-Roman")
    .fontSize(18)
    .text(`Total Amount: ${target.totalAmountLYD}`, { align: "left" });
  doc
    .font("Times-Roman")
    .fontSize(18)
    .text(`Bonus Amount: ${target.bonusAmount}`, { align: "left" });

  doc.moveDown();
  doc
    .font("Times-Roman")
    .fontSize(20)
    .text("Contracts Achieved:", { align: "left" });

  contracts.forEach((contract, index) => {
    doc
      .font("Times-Roman")
      .fontSize(16)
      .text(`${index + 1}. ${contract.companyName}`, { align: "left" });
  });

  doc.end();

  return new Promise<string>((resolve, reject) => {
    stream.on("finish", () => {
      resolve(pdfPath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};
