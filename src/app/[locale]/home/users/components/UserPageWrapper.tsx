"use client";

import React from "react";
import UsersPage from "../components/UserPage";
import { UserProvider, useUsers } from "../../../context/UserContext";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const UsersPageWrapper: React.FC = () => {
  return (
    <UserProvider>
      <UsersPageWithContext />
    </UserProvider>
  );
};

const UsersPageWithContext: React.FC = () => {
  useRequireAuth();
  const { users } = useUsers();

  return <UsersPage users={users} />;
};

export default UsersPageWrapper;
