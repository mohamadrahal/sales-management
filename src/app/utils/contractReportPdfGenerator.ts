import { Contract } from "@prisma/client";
import { createWriteStream, existsSync, mkdirSync } from "fs";
import PDFDocument from "pdfkit";
import path from "path";

// Extend the Contract type to include related properties
interface ExtendedContract extends Contract {
  salesman?: {
    id: number;
    name: string;
    teamId: number | null; // Adjust teamId to be number | null
  };
  branches: {
    id: number;
    name: string;
    city: string;
  }[];
}

interface ReportDetails {
  secondSelect: string;
  lastSelect: string;
  periodFrom: string;
  periodTo: string;
}

export const generateContractReportPDF = async (
  contracts: ExtendedContract[],
  reportDetails: ReportDetails
): Promise<string> => {
  const pdfDirectory = path.join(process.cwd(), "public", "reports");
  const pdfPath = path.join(pdfDirectory, `contract-report-${Date.now()}.pdf`);

  if (!existsSync(pdfDirectory)) {
    mkdirSync(pdfDirectory, { recursive: true });
  }

  const doc = new PDFDocument();
  const stream = createWriteStream(pdfPath);

  doc.pipe(stream);

  // Use built-in font "Times-Roman"
  doc
    .font("Times-Roman")
    .fontSize(25)
    .text("Contract Report", { align: "center" });

  contracts.forEach((contract, index) => {
    doc
      .font("Times-Roman")
      .fontSize(18)
      .text(`Contract ${index + 1}`, { align: "left" });
    doc
      .font("Times-Roman")
      .fontSize(16)
      .text(`Company Name: ${contract.companyName}`, { align: "left" });
    doc
      .font("Times-Roman")
      .fontSize(16)
      .text(`Business Type: ${contract.businessType}`, { align: "left" });
    doc
      .font("Times-Roman")
      .fontSize(16)
      .text(`Status: ${contract.status}`, { align: "left" });
    doc
      .font("Times-Roman")
      .fontSize(16)
      .text(`Created At: ${contract.createdAt.toDateString()}`, {
        align: "left",
      });

    if (contract.salesman) {
      doc
        .font("Times-Roman")
        .fontSize(16)
        .text(`Salesman ID: ${contract.salesman.id}`, { align: "left" });
      doc
        .font("Times-Roman")
        .fontSize(16)
        .text(`Salesman Name: ${contract.salesman.name}`, { align: "left" });
    }

    if (contract.branches.length > 0) {
      doc.font("Times-Roman").fontSize(16).text("Branches:", { align: "left" });
      contract.branches.forEach((branch) => {
        doc
          .font("Times-Roman")
          .fontSize(14)
          .text(`- ${branch.name} (${branch.city})`, { align: "left" });
      });
    }

    doc.moveDown();
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
