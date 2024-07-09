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
import { Report } from "../../../types/types"; // Adjust the path to where your types file is located
import useRequireAuth from "../hooks/useRequireAuth";

interface ReportsContextProps {
  reports: Report[];
  fetchReports: (page: number, limit: number) => void;
  totalCount: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const ReportsContext = createContext<ReportsContextProps | undefined>(
  undefined
);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const { token, loading } = useRequireAuth();

  const fetchReports = useCallback(
    async (page = 1, limit = 10) => {
      if (!token) return;
      try {
        const response = await axios.get("/api/reports", {
          params: { page, limit },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { reports, totalCount } = response.data;
        setReports(reports);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (!loading && token) {
      fetchReports(currentPage, 10); // Ensure fetchReports is called with currentPage
    }
  }, [fetchReports, currentPage, loading, token]);

  const contextValue = useMemo(
    () => ({
      reports,
      fetchReports,
      totalCount,
      currentPage,
      setCurrentPage,
    }),
    [reports, totalCount, currentPage, fetchReports]
  );

  return (
    <ReportsContext.Provider value={contextValue}>
      {children}
    </ReportsContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportsContext);
  if (context === undefined) {
    throw new Error("useReports must be used within a ReportsProvider");
  }
  return context;
};
