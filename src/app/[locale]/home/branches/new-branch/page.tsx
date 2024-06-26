"use client";

import React from "react";
import NewBranchPage from "./components/NewBranchPage";
import { BranchesProvider } from "../../../context/BranchContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const NewBranchPageWrapper = () => {
  return (
    <BranchesProvider>
      <NewBranchPageWithContext />
    </BranchesProvider>
  );
};

const NewBranchPageWithContext = () => {
  useRequireAuth();

  return <NewBranchPage />;
};

export default NewBranchPageWrapper;
