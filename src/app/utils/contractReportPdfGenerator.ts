import fs from "fs";
import path from "path";
import { PDFDocument, rgb } from "pdf-lib";
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
  const page = pdfDoc.addPage();
  const { width, height } = page.getSize();
  const fontSize = 12;

  // Add period range at the top of the PDF
  page.drawText(
    `Period: ${reportDetails.periodFrom} to ${reportDetails.periodTo}`,
    {
      x: 50,
      y: height - 30,
      size: 14,
      color: rgb(0, 0, 0),
    }
  );

  page.drawText("Contract Report", {
    x: 50,
    y: height - 50,
    size: 25,
    color: rgb(0, 0, 0),
  });

  let yPosition = height - 80;

  contracts.forEach((contract, index) => {
    if (yPosition < 50) {
      yPosition = height - 50;
      pdfDoc.addPage();
    }

    page.drawText(`Contract ${index + 1}`, {
      x: 50,
      y: yPosition,
      size: 18,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Company Name: ${contract.companyName}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Business Type: ${contract.businessType}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(`Status: ${contract.status}`, {
      x: 50,
      y: yPosition,
      size: fontSize,
      color: rgb(0, 0, 0),
    });
    yPosition -= fontSize;

    page.drawText(
      `Created At: ${new Date(contract.createdAt).toDateString()}`,
      {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      }
    );
    yPosition -= fontSize;

    if (contract.salesman) {
      page.drawText(`Salesman ID: ${contract.salesman.id}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize;

      page.drawText(`Salesman Name: ${contract.salesman.name}`, {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize;
    }

    if (contract.branches.length > 0) {
      page.drawText("Branches:", {
        x: 50,
        y: yPosition,
        size: fontSize,
        color: rgb(0, 0, 0),
      });
      yPosition -= fontSize;

      contract.branches.forEach((branch) => {
        page.drawText(`- ${branch.name} (${branch.city})`, {
          x: 70,
          y: yPosition,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
        yPosition -= fontSize;
      });
    }

    yPosition -= fontSize;
  });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(pdfPath, pdfBytes);

  return pdfPath;
};
