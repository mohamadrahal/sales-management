// context/UserContext.tsx

"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import axios from "axios";
import { User, Team } from "@prisma/client";
import useRequireAuth from "../hooks/useRequireAuth";

interface UserContextProps {
  users: (User & { team: Team | null; managedTeams: Team[] })[];
  fetchUsers: (
    page: number,
    limit: number,
    searchTerm?: string,
    searchField?: string
  ) => void;
  totalCount: number;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<
    (User & { team: Team | null; managedTeams: Team[] })[]
  >([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const { token } = useRequireAuth();

  const fetchUsers = useCallback(
    async (page = 1, limit = 10, searchTerm = "", searchField = "") => {
      if (!token) {
        console.error("No token found");
        return;
      }

      try {
        const response = await axios.get("/api/users", {
          params: { page, limit, searchTerm, searchField },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { users, totalCount } = response.data;
        setUsers(users);
        setTotalCount(totalCount);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    },
    [token]
  );

  useEffect(() => {
    if (token) {
      fetchUsers(1, 10); // Ensure fetchUsers is called with default parameters
    }
  }, [fetchUsers, token]);

  const contextValue = useMemo(
    () => ({
      users,
      fetchUsers,
      totalCount,
    }),
    [users, totalCount, fetchUsers]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UserProvider");
  }
  return context;
};
