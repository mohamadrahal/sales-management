"use client";

import React, { useState } from "react";
import Table from "../../components/reusables/Table";
import AddButton from "../../components/reusables/AddButton";
import { Team } from "../../../../../types/types";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../components/reusables/Pagination";
import { useTeams } from "../../context/TeamsContext";

interface TeamsPageProps {
  teams: Team[];
}

const teamsColumns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Location", accessor: "location" },
  { header: "Salesmen Count", accessor: "salesmenCount" },
];

const TeamsPage: React.FC<TeamsPageProps> = () => {
  const { teams, fetchTeams, totalCount } = useTeams();
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTeams(page, pageSize);
  };

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: Team) => alert(`Edit team ${row.name}`),
      className: "bg-green-400 hover:bg-green-600",
    },
    {
      icon: FaEye,
      onClick: (row: Team) => alert(`View team ${row.name}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: Team) => alert(`Delete team ${row.name}`),
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Teams</h1>
        <AddButton text="Add Team" link={`/teams/new-team`} />
      </div>
      <Table columns={teamsColumns} data={teams} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TeamsPage;
