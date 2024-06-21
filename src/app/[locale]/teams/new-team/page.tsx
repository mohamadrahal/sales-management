"use client";

import React from "react";
import NewTeam from "./components/NewTeam";
import { TeamsProvider } from "../../context/TeamsContext";

const NewTeamWrapper: React.FC = () => {
  return (
    <TeamsProvider>
      <NewTeamWithContext />
    </TeamsProvider>
  );
};

const NewTeamWithContext: React.FC = () => {
  return <NewTeam />;
};

export default NewTeamWrapper;
