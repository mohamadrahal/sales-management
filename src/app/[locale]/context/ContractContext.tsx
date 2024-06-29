"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { Contract } from "../../../types/types";
import useRequireAuth from "../hooks/useRequireAuth";

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

  const { token } = useRequireAuth();

  const fetchContracts = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const response = await axios.get("/api/contracts", {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { contracts, totalCount } = response.data;
        setContracts(contracts);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchContracts(1, 10);
    }
  }, [fetchContracts, token]);

  const addContract = (contract: Contract) => {
    setContracts((prevContracts) => [...prevContracts, contract]);
  };

  const contextValue = useMemo(
    () => ({
      contracts,
      addContract,
      fetchContracts,
      totalCount,
    }),
    [contracts, totalCount, fetchContracts]
  );

  return (
    <ContractsContext.Provider value={contextValue}>
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
