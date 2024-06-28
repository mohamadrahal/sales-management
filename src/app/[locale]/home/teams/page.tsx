"use client";

import React from "react";
import TeamsPageWrapper from "./components/TeamsPageWrapper";
import { TeamsProvider } from "../../context/TeamsContext";
import useRequireAuth from "../../hooks/useRequireAuth";

const HomePage = () => {
  return (
    <TeamsProvider>
      <div>
        <TeamsPageWrapper />
      </div>
    </TeamsProvider>
  );
};

export default HomePage;
