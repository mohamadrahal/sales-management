// components/BranchPageWrapper.tsx
"use client";

import React from "react";
import BranchesPage from "./BranchesPage";
import { BranchesProvider, useBranches } from "../../../context/BranchContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const BranchesPageWrapper = () => {
  return (
    <BranchesProvider>
      <BranchesPageWithContext />
    </BranchesProvider>
  );
};

const BranchesPageWithContext = () => {
  useRequireAuth();
  const { branches } = useBranches();

  return <BranchesPage branches={branches} />;
};

export default BranchesPageWrapper;
