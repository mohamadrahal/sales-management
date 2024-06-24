"use client";

import React from "react";
import NewContractPage from "./components/NewContractPage";
import { ContractsProvider } from "@/app/[locale]/context/ContractContext";

const NewContractWrapper = () => {
  return (
    <ContractsProvider>
      <NewContractWithContext />
    </ContractsProvider>
  );
};

const NewContractWithContext = () => {
  return <NewContractPage />;
};

export default NewContractWrapper;
