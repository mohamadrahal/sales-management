// components/reusables/ContractDetails.tsx
"use client";

import React from "react";
import { ContractWithBranches } from "../../../../../types/types";
import DownloadButton from "./DownloadButton";
import Table, { Column } from "../../../components/reusables/Table";
import { useTranslations } from "next-intl";

interface ContractDetailsProps {
  contract: ContractWithBranches;
}

const ContractDetails: React.FC<ContractDetailsProps> = ({ contract }) => {
  const t = useTranslations();

  const branchColumns = t.raw("branchColumns");

  return (
    <div className="bg-white p-6 m-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Contract Details</h2>
      <div className="mb-2">
        <strong>Company Name:</strong> {contract.companyName}
      </div>
      <div className="mb-2">
        <strong>Owner Name:</strong> {contract.ownerName}
      </div>
      <div className="mb-2">
        <strong>Business Type:</strong> {contract.businessType}
      </div>
      <div className="mb-2">
        <strong>Salesman:</strong> {contract.salesman.name}
      </div>
      <div className="mb-2">
        <strong>Status:</strong> {contract.status}
      </div>
      <div className="mb-2">
        <strong>Number of Branches:</strong> {contract.branches.length}
      </div>

      <h3 className="text-xl font-semibold mt-6 mb-2">Branches</h3>
      <Table columns={branchColumns} data={contract.branches} />

      <DownloadButton
        contractId={contract.id}
        fileName={contract.companyName}
        documentPath={contract.documentPath}
      />
    </div>
  );
};

export default ContractDetails;
