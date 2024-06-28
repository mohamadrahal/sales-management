"use client";

import React from "react";
import UsersPageWrapper from "./components/UserPageWrapper";
import { UsersProvider } from "../../context/UserContext";
import useRequireAuth from "../../hooks/useRequireAuth";

const HomePage = () => {
  return (
    <UsersProvider>
      <div>
        <UsersPageWrapper />
      </div>
    </UsersProvider>
  );
};

export default HomePage;
