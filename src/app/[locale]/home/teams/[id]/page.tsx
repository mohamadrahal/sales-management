"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Team } from "../../../../../../types/types";
import Table from "../../../components/reusables/Table";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

interface Salesman {
  id: number;
  name: string;
}

interface TeamWithSalesmen extends Team {
  salesmen: Salesman[];
}

const salesmenColumns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
];

const TeamDetails: React.FC = () => {
  const { id } = useParams();
  const [team, setTeam] = useState<TeamWithSalesmen | null>(null);
  const [loading, setLoading] = useState(true);

  useRequireAuth();

  useEffect(() => {
    const fetchTeamDetails = async () => {
      try {
        const response = await axios.get(`/api/teams/${id}`);
        setTeam(response.data);
      } catch (error) {
        console.error("Failed to fetch team details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold">Team Details</h1>
      <div className="mt-4">
        <p>
          <strong>ID:</strong> {team.id}
        </p>
        <p>
          <strong>Name:</strong> {team.name}
        </p>
        <p>
          <strong>Location:</strong> {team.location}
        </p>
        <p>
          <strong>Salesmen Count:</strong> {team.salesmen.length}
        </p>
        <h2 className="text-xl font-semibold mt-4">Salesmen</h2>
        <Table columns={salesmenColumns} data={team.salesmen} />
      </div>
    </div>
  );
};

export default TeamDetails;
