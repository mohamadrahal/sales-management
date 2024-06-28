// pages/home/targets/page.tsx
"use client";

import React from "react";
import { TargetsProvider } from "../../context/TargetsContext";
import TargetsPageWrapper from "./components/TargetsPageWrapper";
import useRequireAuth from "../../hooks/useRequireAuth";

const HomePage = () => {
  return (
    <TargetsProvider>
      <div>
        <TargetsPageWrapper />
      </div>
    </TargetsProvider>
  );
};

export default HomePage;
