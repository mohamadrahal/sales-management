"use client";

import React from "react";
import TeamsPageWrapper from "./components/TeamsPageWrapper";
import { TeamsProvider } from "../../context/TeamsContext";

const HomePage: React.FC = () => {
  return (
    <TeamsProvider>
      <div>
        <TeamsPageWrapper />
      </div>
    </TeamsProvider>
  );
};

export default HomePage;
