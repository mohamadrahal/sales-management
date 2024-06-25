"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { Team } from "../../../types/types";

interface TeamsContextProps {
  teams: Team[];
  addTeam: (team: Team) => void;
  fetchTeams: (page: number, limit: number) => void;
  totalCount: number;
}

const TeamsContext = createContext<TeamsContextProps | undefined>(undefined);

export const TeamsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  const fetchTeams = async (page = 1, limit = 10) => {
    try {
      const response = await axios.get("/api/teams", {
        params: { page, limit },
      });
      const { teams, totalCount } = response.data;
      setTeams(teams);
      setTotalCount(totalCount);
    } catch (error) {
      console.error("Failed to fetch teams:", error);
    }
  };

  useEffect(() => {
    fetchTeams(1, 10); // Ensure fetchTeams is called with default parameters
  }, []);

  const addTeam = (team: Team) => {
    setTeams((prevTeams) => [...prevTeams, team]);
  };

  return (
    <TeamsContext.Provider value={{ teams, addTeam, fetchTeams, totalCount }}>
      {children}
    </TeamsContext.Provider>
  );
};

export const useTeams = () => {
  const context = useContext(TeamsContext);
  if (context === undefined) {
    throw new Error("useTeams must be used within a TeamsProvider");
  }
  return context;
};
