"use client";

import React from "react";
import UsersPageWrapper from "./components/UserPageWrapper";
import { UserProvider } from "../../context/UserContext";
import { NextIntlClientProvider } from "next-intl";

const HomePage = () => {
  return (
    <UserProvider>
      <div>
        <UsersPageWrapper />
      </div>
    </UserProvider>
  );
};

export default HomePage;
