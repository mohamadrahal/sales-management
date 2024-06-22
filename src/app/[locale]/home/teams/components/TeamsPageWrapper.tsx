"use client";

import React from "react";
import TeamsPage from "./TeamsPage";
import { TeamsProvider, useTeams } from "../../../context/TeamsContext";

const TeamsPageWrapper: React.FC = () => {
  return (
    <TeamsProvider>
      <TeamsPageWithContext />
    </TeamsProvider>
  );
};

const TeamsPageWithContext: React.FC = () => {
  const { teams } = useTeams();

  return <TeamsPage teams={teams} />;
};

export default TeamsPageWrapper;
