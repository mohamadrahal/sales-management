// components/TargetsPageWrapper.tsx
"use client";

import React from "react";
import TargetsPage from "./TargetsPage";
import { TargetsProvider, useTargets } from "../../../context/TargetsContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const TargetsPageWrapper: React.FC = () => {
  return (
    <TargetsProvider>
      <TargetsPageWithContext />
    </TargetsProvider>
  );
};

const TargetsPageWithContext: React.FC = () => {
  useRequireAuth();
  const { targets } = useTargets();

  return <TargetsPage targets={targets} />;
};

export default TargetsPageWrapper;
