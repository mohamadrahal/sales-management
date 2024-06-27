// context/TargetsContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
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

  const fetchTargets = async (page = 1, limit = 10) => {
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
  };

  useEffect(() => {
    fetchTargets(1, 10); // Ensure fetchTargets is called with default parameters
  }, [filter]);

  return (
    <TargetsContext.Provider
      value={{ targets, fetchTargets, totalCount, filter, setFilter }}
    >
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
