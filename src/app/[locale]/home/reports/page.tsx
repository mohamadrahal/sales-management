"use client";

import React from "react";
import { ReportsProvider } from "../../context/ReportsContext";
import ReportsPageWrapper from "./components/ReportsPageWrapper";

const HomePage = () => {
  return (
    <ReportsProvider>
      <div>
        <ReportsPageWrapper />
      </div>
    </ReportsProvider>
  );
};

export default HomePage;
