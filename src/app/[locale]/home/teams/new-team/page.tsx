"use client";

import React from "react";
import NewTeam from "./components/NewTeam";
import { TeamsProvider } from "../../../context/TeamsContext";

const NewTeamWrapper = () => {
  return (
    <TeamsProvider>
      <NewTeamWithContext />
    </TeamsProvider>
  );
};

const NewTeamWithContext = () => {
  return <NewTeam />;
};

export default NewTeamWrapper;
