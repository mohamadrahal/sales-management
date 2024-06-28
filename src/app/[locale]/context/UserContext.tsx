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
import { User } from "@prisma/client";

interface UsersContextProps {
  users: User[];
  addUser: (user: User) => void;
  fetchUsers: (page: number, limit: number) => void;
  totalCount: number;
}

const UsersContext = createContext<UsersContextProps | undefined>(undefined);

export const UsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchUsers = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await axios.get("/api/users", {
        params: { page, limit },
      });
      const { users, totalCount } = response.data;
      setUsers(users);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  }, []);

  useEffect(() => {
    fetchUsers(1, 10);
  }, [fetchUsers]);

  const addUser = (user: User) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const contextValue = useMemo(
    () => ({
      users,
      addUser,
      fetchUsers,
      totalCount,
    }),
    [users, totalCount, fetchUsers]
  );

  return (
    <UsersContext.Provider value={contextValue}>
      {children}
    </UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (context === undefined) {
    throw new Error("useUsers must be used within a UsersProvider");
  }
  return context;
};
