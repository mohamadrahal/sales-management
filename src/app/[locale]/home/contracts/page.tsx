"use client";

import React from "react";
import ContractPageWrapper from "./components/ContractsPageWrapper";
import { ContractsProvider } from "../../context/ContractContext";
import useRequireAuth from "../../hooks/useRequireAuth";

const HomePage = () => {
  return (
    <ContractsProvider>
      <div>
        <ContractPageWrapper />
      </div>
    </ContractsProvider>
  );
};

export default HomePage;
