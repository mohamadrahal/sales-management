import React from "react";
import Table from "../components/reusables/Table";
import AddButton from "../components/reusables/AddButton";
import prisma from "../../../../prisma/client";

const teamsColumns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Location", accessor: "location" },
  { header: "Salesmen Count", accessor: "salesmenCount" },
];

const TeamsPage = async () => {
  const teams = await prisma.team.findMany();

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <AddButton text="Add Team" link={`/teams/new-team`} />
      </div>
      <Table columns={teamsColumns} data={teams} />
    </div>
  );
};

export default TeamsPage;