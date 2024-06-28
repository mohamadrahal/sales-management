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
import { Target } from "../../../types/types"; // Adjust the path to where your types file is located

interface TargetsContextProps {
  targets: Target[];
  fetchTargets: (page: number, limit: number) => void;
  totalCount: number;
  filter: string;
  setFilter: (filter: string) => void;
}

const TargetsContext = createContext<TargetsContextProps | undefined>(
  undefined
);

export const TargetsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [targets, setTargets] = useState<Target[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [filter, setFilter] = useState<string>("team");

  const fetchTargets = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const response = await axios.get("/api/targets", {
          params: { page, limit, filter },
        });
        const { targets, totalCount } = response.data;
        setTargets(targets);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch targets:", error);
      }
    },
    [filter]
  );

  useEffect(() => {
    fetchTargets(1, 10); // Ensure fetchTargets is called with default parameters
  }, [fetchTargets, filter]);

  const contextValue = useMemo(
    () => ({
      targets,
      fetchTargets,
      totalCount,
      filter,
      setFilter,
    }),
    [targets, totalCount, filter, fetchTargets]
  );

  return (
    <TargetsContext.Provider value={contextValue}>
      {children}
    </TargetsContext.Provider>
  );
};

export const useTargets = () => {
  const context = useContext(TargetsContext);
  if (context === undefined) {
    throw new Error("useTargets must be used within a TargetsProvider");
  }
  return context;
};