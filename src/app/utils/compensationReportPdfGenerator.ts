import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
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
  targetAchieved: boolean
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

  // Add title
  page.drawText("Compensation Report", {
    x: 50,
    y: height - 50,
    size: 25,
    color: rgb(0, 0, 0),
  });

  {
    target.individual &&
      page.drawText(`Salesman: ${target.individual?.name}`, {
        x: 50,
        y: height - 80,
        size: 18,
        color: rgb(0, 0, 0),
      });
  }
  // Add target details

  page.drawText(`Target: ${target.numberOfContracts} contracts`, {
    x: 50,
    y: height - 100,
    size: 18,
    color: rgb(0, 0, 0),
  });
  page.drawText(
    `Period: ${target.periodFrom.toDateString()} - ${target.periodTo.toDateString()}`,
    {
      x: 50,
      y: height - 120,
      size: 18,
      color: rgb(0, 0, 0),
    }
  );
  page.drawText(`Total Amount: ${target.totalAmountLYD}`, {
    x: 50,
    y: height - 140,
    size: 18,
    color: rgb(0, 0, 0),
  });

  {
    target.bonusAmount &&
      page.drawText(`Bonus Amount: ${target.bonusAmount}`, {
        x: 50,
        y: height - 160,
        size: 18,
        color: rgb(0, 0, 0),
      });
  }

  // Add contracts achieved
  page.drawText("Contracts Achieved:", {
    x: 50,
    y: height - 190,
    size: 20,
    color: rgb(0, 0, 0),
  });

  let yPosition = height - 220;

  contracts.forEach((contract, index) => {
    if (yPosition < 50) {
      yPosition = height - 50;
      page = pdfDoc.addPage();
    }

    page.drawText(`${index + 1}. ${contract.companyName}`, {
      x: 50,
      y: yPosition,
      size: 16,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Status: ${contract.status}`, {
      x: 70,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Salesman ID: ${contract.salesman?.id}`, {
      x: 70,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Salesman Name: ${contract.salesman?.name}`, {
      x: 70,
      y: yPosition,
      size: 14,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize + 10;
  });

  // Add target achievement status
  page.drawText(`Target Achieved: ${targetAchieved ? "Yes" : "No"}`, {
    x: 50,
    y: yPosition - 20,
    size: 18,
    color: rgb(0, 0, 0),
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
};
