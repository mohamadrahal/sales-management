import React from "react";
import prisma from "../../../../prisma/client";
import Table from "../components/Table";

const teamsColumns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Location", accessor: "location" },
];

const TeamsPage = async () => {
  const teams = await prisma.team.findMany();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>
      <Table columns={teamsColumns} data={teams} />
    </div>
  );
};

export default TeamsPage;
