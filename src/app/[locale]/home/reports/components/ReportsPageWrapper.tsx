// src/components/ReportsPageWrapper.tsx

"use client";

import React from "react";
import ReportsPage from "./ReportsPage";
import { ReportsProvider, useReports } from "../../../context/ReportsContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const ReportsPageWrapper: React.FC = () => {
  return (
    <ReportsProvider>
      <ReportsPageWithContext />
    </ReportsProvider>
  );
};

const ReportsPageWithContext: React.FC = () => {
  useRequireAuth();
  const { reports } = useReports();

  return <ReportsPage reports={reports} />;
};

export default ReportsPageWrapper;
