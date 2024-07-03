// src/context/ReportsContext.tsx

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

interface ReportsContextProps {
  reports: Report[];
  fetchReports: (page: number, limit: number) => void;
  totalCount: number;
  reportType: string;
  setReportType: (type: string) => void;
  filterType: string;
  setFilterType: (type: string) => void;
  filterValue: string;
  setFilterValue: (value: string) => void;
}

const ReportsContext = createContext<ReportsContextProps | undefined>(
  undefined
);

export const ReportsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [reportType, setReportType] = useState<string>("Contract Report");
  const [filterType, setFilterType] = useState<string>("per period");
  const [filterValue, setFilterValue] = useState<string>("");

  const fetchReports = useCallback(
    async (page = 1, limit = 10) => {
      try {
        const response = await axios.get(
          `/api/reports/${reportType.toLowerCase().replace(" ", "-")}`,
          {
            params: { page, limit, filterType, filterValue },
          }
        );
        const { reports, totalCount } = response.data;
        setReports(reports);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch reports:", error);
      }
    },
    [reportType, filterType, filterValue]
  );

  useEffect(() => {
    fetchReports(1, 10); // Ensure fetchReports is called with default parameters
  }, [fetchReports]);

  const contextValue = useMemo(
    () => ({
      reports,
      fetchReports,
      totalCount,
      reportType,
      setReportType,
      filterType,
      setFilterType,
      filterValue,
      setFilterValue,
    }),
    [reports, totalCount, reportType, filterType, filterValue, fetchReports]
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
