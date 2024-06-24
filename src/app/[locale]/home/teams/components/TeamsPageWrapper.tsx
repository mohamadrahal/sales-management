"use client";

import React from "react";
import TeamsPage from "./TeamsPage";
import { TeamsProvider, useTeams } from "../../../context/TeamsContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const TeamsPageWrapper: React.FC = () => {
  return (
    <TeamsProvider>
      <TeamsPageWithContext />
    </TeamsProvider>
  );
};

const TeamsPageWithContext: React.FC = () => {
  useRequireAuth();
  const { teams } = useTeams();

  return <TeamsPage teams={teams} />;
};

export default TeamsPageWrapper;
