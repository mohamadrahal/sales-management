"use client";

import React from "react";
import NewTargetPage from "./components/NewTargetPage";
import { TargetsProvider } from "@/app/[locale]/context/TargetsContext";

const NewTargetWrapper = () => {
  return (
    <TargetsProvider>
      <NewTargetWithContext />
    </TargetsProvider>
  );
};

const NewTargetWithContext = () => {
  return <NewTargetPage />;
};

export default NewTargetWrapper;
