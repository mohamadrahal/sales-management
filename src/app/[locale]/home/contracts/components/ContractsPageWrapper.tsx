// components/ContractPageWrapper.tsx
"use client";

import React from "react";
import ContractPage from "./ContractsPage";
import {
  ContractsProvider,
  useContracts,
} from "../../../context/ContractContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const ContractsPageWrapper: React.FC = () => {
  return (
    <ContractsProvider>
      <ContractPageWithContext />
    </ContractsProvider>
  );
};

const ContractPageWithContext: React.FC = () => {
  useRequireAuth();
  const { contracts } = useContracts();

  return <ContractPage contracts={contracts} />;
};

export default ContractsPageWrapper;
