// utils/reportGenerators.ts
import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
import ExcelJS from "exceljs";
import { Contract, Target, User } from "@prisma/client";

// Extend the Target type to include the individual property
interface ExtendedTarget extends Target {
  individual?: User;
}

// Extend the Contract type to include salesman details
interface ExtendedContract extends Contract {
  salesman?: User;
}

export const generatePDF = async (
  contracts: ExtendedContract[],
  target: ExtendedTarget,
  targetAchieved: boolean,
  amountPaid: number
): Promise<string> => {
  const pdfDirectory = path.join(process.cwd(), "public", "reports");
  const pdfPath = path.join(
    pdfDirectory,
    `compensation-report-${Date.now()}.pdf`
  );

  if (!fs.existsSync(pdfDirectory)) {
    fs.mkdirSync(pdfDirectory, { recursive: true });
  }

  const pdfDoc = await PDFDocument.create();
  let page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;
  const tableTop = height - 200;
  const margin = 50;

  // Add title
  page.drawText("Compensation Report", {
    x: margin,
    y: height - 50,
    size: 25,
    color: rgb(0, 0, 0),
  });

  // Add target details
  let yPosition = height - 80;
  if (target.individual) {
    page.drawText(`Salesman: ${target.individual?.name}`, {
      x: margin,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }
  page.drawText(`Target: ${target.numberOfContracts} contracts`, {
    x: margin,
    y: yPosition,
    size: 18,
    color: rgb(0, 0, 0),
  });
  yPosition -= 20;
  page.drawText(
    `Period: ${target.periodFrom.toDateString()} - ${target.periodTo.toDateString()}`,
    {
      x: margin,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    }
  );
  yPosition -= 20;
  page.drawText(`Total Amount: ${target.totalAmountLYD}`, {
    x: margin,
    y: yPosition,
    size: 18,
    color: rgb(0, 0, 0),
  });
  yPosition -= 20;
  if (target.bonusAmount) {
    page.drawText(`Bonus Amount: ${target.bonusAmount}`, {
      x: margin,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });
    yPosition -= 20;
  }

  // Add target achievement status
  page.drawText(`Target Achieved: ${targetAchieved ? "Yes" : "No"}`, {
    x: margin,
    y: yPosition,
    size: 18,
    color: rgb(0, 0, 0),
  });
  yPosition -= 20;

  // Add amount paid
  page.drawText(`Amount Paid: ${amountPaid}`, {
    x: margin,
    y: yPosition,
    size: 18,
    color: rgb(0, 0, 0),
  });
  yPosition -= 40;

  // Add contracts achieved table header
  page.drawText("Contracts Achieved:", {
    x: margin,
    y: tableTop,
    size: 20,
    color: rgb(0, 0, 0),
  });

  const tableColumnHeaders = ["#", "Company Name", "Status", "Salesman ID"];
  const tableColumnWidths = [30, 150, 80, 100, 100];

  let currentX = margin;
  let currentY = tableTop - 30;

  tableColumnHeaders.forEach((header, i) => {
    page.drawText(header, {
      x: currentX,
      y: currentY,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    currentX += tableColumnWidths[i];
  });

  currentY -= 20;

  // Add contracts achieved table rows
  contracts.forEach((contract, index) => {
    currentX = margin;
    const rowValues = [
      (index + 1).toString(),
      contract.companyName,
      contract.status,
      contract.salesman?.id?.toString() || "",
      contract.salesman?.name || "",
    ];

    rowValues.forEach((value, i) => {
      page.drawText(value, {
        x: currentX,
        y: currentY,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      currentX += tableColumnWidths[i];
    });
    currentY -= 20;

    if (currentY < margin) {
      page = pdfDoc.addPage();
      currentY = height - margin;
    }
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
};

export const generateExcel = async (
  contracts: ExtendedContract[],
  target: ExtendedTarget,
  targetAchieved: boolean,
  amountPaid: number
): Promise<string> => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Compensation Report");

  // Add title
  worksheet.mergeCells("A1:E1");
  worksheet.getCell("A1").value = "Compensation Report";
  worksheet.getCell("A1").font = { size: 25, bold: true };
  worksheet.getCell("A1").alignment = { horizontal: "center" };

  // Add target details
  let row = worksheet.addRow([]);
  row = worksheet.addRow([]);
  if (target.individual) {
    row = worksheet.addRow(["Salesman:", target.individual.name]);
  }
  row = worksheet.addRow(["Target:", `${target.numberOfContracts} contracts`]);
  row = worksheet.addRow([
    "Period:",
    `${target.periodFrom.toDateString()} - ${target.periodTo.toDateString()}`,
  ]);
  row = worksheet.addRow(["Total Amount:", target.totalAmountLYD]);
  if (target.bonusAmount) {
    row = worksheet.addRow(["Bonus Amount:", target.bonusAmount]);
  }
  row = worksheet.addRow(["Target Achieved:", targetAchieved ? "Yes" : "No"]);
  row = worksheet.addRow(["Amount Paid:", amountPaid]);

  // Add contracts achieved table
  worksheet.addRow([]);
  const headerRow = worksheet.addRow([
    "#",
    "Company Name",
    "Status",
    "Salesman ID",
  ]);

  // Style header
  headerRow.eachCell?.((cell) => {
    cell.font = { size: 14, bold: true };
    cell.alignment = { horizontal: "center" };
  });

  contracts.forEach((contract, index) => {
    const row = worksheet.addRow([
      index + 1,
      contract.companyName,
      contract.status,
      contract.salesman?.id?.toString() || "",
      contract.salesman?.name || "",
    ]);
    row.eachCell?.((cell) => {
      cell.font = { size: 12 };
      cell.alignment = { horizontal: "left" };
    });
  });

  // Adjust column widths
  worksheet.columns.forEach((column) => {
    if (column && column.eachCell) {
      let maxLength = 0;
      column.eachCell({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
      column.width = maxLength + 2;
    }
  });

  const excelDirectory = path.join(process.cwd(), "public", "reports");
  const excelPath = path.join(
    excelDirectory,
    `compensation-report-${Date.now()}.xlsx`
  );

  if (!fs.existsSync(excelDirectory)) {
    fs.mkdirSync(excelDirectory, { recursive: true });
  }

  await workbook.xlsx.writeFile(excelPath);

  return excelPath;
};
