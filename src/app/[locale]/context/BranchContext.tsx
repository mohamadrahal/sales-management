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
import { Branch } from "../../../types/types";

interface BranchesContextProps {
  branches: Branch[];
  addBranch: (branch: Branch) => void;
  fetchBranches: (page: number, limit: number) => void;
  totalCount: number;
}

const BranchesContext = createContext<BranchesContextProps | undefined>(
  undefined
);

export const BranchesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchBranches = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await axios.get("/api/branches", {
        params: { page, limit },
      });
      const { branches, totalCount } = response.data;
      setBranches(branches);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch branches:", error);
    }
  }, []);

  useEffect(() => {
    fetchBranches(1, 10);
  }, [fetchBranches]);

  const addBranch = (branch: Branch) => {
    setBranches((prevBranches) => [...prevBranches, branch]);
  };

  const contextValue = useMemo(
    () => ({
      branches,
      addBranch,
      fetchBranches,
      totalCount,
    }),
    [branches, totalCount, fetchBranches]
  );

  return (
    <BranchesContext.Provider value={contextValue}>
      {children}
    </BranchesContext.Provider>
  );
};

export const useBranches = () => {
  const context = useContext(BranchesContext);
  if (context === undefined) {
    throw new Error("useBranches must be used within a BranchesProvider");
  }
  return context;
};
