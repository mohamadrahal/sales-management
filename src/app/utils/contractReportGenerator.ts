import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import ExcelJS from "exceljs";
import { Contract } from "@prisma/client";

interface ReportDetails {
  secondSelect: string;
  lastSelect: string;
  periodFrom: string;
  periodTo: string;
}

// Extend the Contract type to include relations
interface ExtendedContract extends Contract {
  branches: {
    id: number;
    contractId: number;
    name: string;
    phone: string;
    city: string;
    locationX: number;
    locationY: number;
  }[];
  salesman: {
    id: number;
    role: string;
    username: string;
    password: string;
    name: string;
    mobileNumber: string;
    bcdAccount: string | null;
    evoAppId: string;
    nationalId: string;
    teamId: number | null;
  };
}

export const generateContractReportPDF = async (
  contracts: ExtendedContract[],
  reportDetails: ReportDetails
): Promise<string> => {
  const pdfDirectory = path.join(process.cwd(), "public", "reports");
  const pdfPath = path.join(pdfDirectory, `contract-report-${Date.now()}.pdf`);

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;

  // Add period range at the top of the PDF

  page.drawText("Contract Report", {
    x: 50,
    y: height - 50,
    size: 20,
    color: rgb(0, 0, 0),
  });

  page.drawText(
    `Period: ${reportDetails.periodFrom} to ${reportDetails.periodTo}`,
    {
      x: 50,
      y: height - 70,
      size: 14,
      color: rgb(0, 0, 0),
    }
  );

  let yPosition = height - 100;

  // Table Headers
  page.drawText("No.", { x: 50, y: yPosition, size: 14, color: rgb(0, 0, 0) });
  page.drawText("Company Name", {
    x: 100,
    y: yPosition,
    size: 14,
    color: rgb(0, 0, 0),
  });
  page.drawText("Business Type", {
    x: 250,
    y: yPosition,
    size: 14,
    color: rgb(0, 0, 0),
  });
  page.drawText("Status", {
    x: 380,
    y: yPosition,
    size: 14,
    color: rgb(0, 0, 0),
  });
  page.drawText("Salesman", {
    x: 450,
    y: yPosition,
    size: 14,
    color: rgb(0, 0, 0),
  });
  yPosition -= fontSize + 10;

  contracts.forEach((contract, index) => {
    if (yPosition < 50) {
      yPosition = height - 50;
      page = pdfDoc.addPage();
    }

    page.drawText(`${index + 1}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${contract.companyName}`, {
      x: 100,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${contract.businessType}`, {
      x: 250,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${contract.status}`, {
      x: 380,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    page.drawText(`${contract.salesman.name}`, {
      x: 450,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });

    yPosition -= fontSize + 5;
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
};

export const generateContractReportExcel = async (
  contracts: ExtendedContract[],
  reportDetails: ReportDetails
): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Contract Report");

  // Add title
  worksheet.mergeCells("A1:E1");
  worksheet.getCell("A1").value = "Contract Report";
  worksheet.getCell("A1").font = { size: 25, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  // Add period range
  worksheet.addRow([
    `Period: ${reportDetails.periodFrom} to ${reportDetails.periodTo}`,
  ]);
  worksheet.addRow([]);

  // Table Headers
  const headerRow = worksheet.addRow([
    "No.",
    "Company Name",
    "Business Type",
    "Status",
    "Salesman",
  ]);
  headerRow.font = { bold: true };
  headerRow.alignment = { horizontal: "center" };

  contracts.forEach((contract, index) => {
    const row = worksheet.addRow([
      index + 1,
      contract.companyName,
      contract.businessType,
      contract.status,
      contract.salesman.name,
    ]);
    row.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Adjust column widths
  worksheet.columns.forEach((column) => {
    if (column.header) {
      const headerLength = Array.isArray(column.header)
        ? Math.max(...column.header.map((h) => h.length))
        : column.header.length;
      column.width = headerLength < 12 ? 12 : headerLength;
    } else {
      column.width = 12;
    }
  });

  const excelDirectory = path.join(process.cwd(), "public", "reports");
  const excelPath = path.join(
    excelDirectory,
    `contract-report-${Date.now()}.xlsx`
  );

  if (!fs.existsSync(excelDirectory)) {
    fs.mkdirSync(excelDirectory, { recursive: true });
  }

  await workbook.xlsx.writeFile(excelPath);

  return excelPath;
};
