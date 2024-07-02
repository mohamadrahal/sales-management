// app/[locale]/home/contracts/[id]/page.tsx
import React from "react";
import { notFound } from "next/navigation";
import prisma from "../../../../../../prisma/client";
import ContractDetails from "../components/ContractDetails";
import { ContractWithBranches } from "../../../../../types/types";

const ContractPage = async ({ params }: { params: { id: string } }) => {
  const contract = await prisma.contract.findUnique({
    where: { id: parseInt(params.id) },
    include: {
      branches: true,
      salesman: true,
      contractReports: true,
    },
  });

  if (!contract) {
    notFound();
  }

  return <ContractDetails contract={contract as ContractWithBranches} />;
};

export default ContractPage;
