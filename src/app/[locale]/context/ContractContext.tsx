"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Contract } from "../../../../types/types";

interface ContractsContextProps {
  contracts: Contract[];
  addContract: (contract: Contract) => void;
  fetchContracts: (page: number, limit: number) => void;
  totalCount: number;
}

const ContractsContext = createContext<ContractsContextProps | undefined>(
  undefined
);

export const ContractsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchContracts = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get("/api/contracts", {
        params: { page, limit },
      });
      const { contracts, totalCount } = response.data;
      setContracts(contracts);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch contracts:", error);
    }
  };

  useEffect(() => {
    fetchContracts(1, 10); // Ensure fetchContracts is called with default parameters
  }, []);

  const addContract = (contract: Contract) => {
    setContracts((prevContracts) => [...prevContracts, contract]);
  };

  return (
    <ContractsContext.Provider
      value={{ contracts, addContract, fetchContracts, totalCount }}
    >
      {children}
    </ContractsContext.Provider>
  );
};

export const useContracts = () => {
  const context = useContext(ContractsContext);
  if (context === undefined) {
    throw new Error("useContracts must be used within a ContractsProvider");
  }
  return context;
};
