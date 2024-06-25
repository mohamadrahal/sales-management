"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { Team } from "../../../../../types/types";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import { useTeams } from "../../../context/TeamsContext";
import axios from "axios";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useTranslations } from "next-intl";

interface TeamsPageProps {
  teams: Team[];
}



const TeamsPage: React.FC<TeamsPageProps> = ({ teams }) => {
  const t = useTranslations();
  const t2 = useTranslations("teamsHeader");

  const teamsColumns = t.raw("teamsColumns");
  const router = useRouter();
  const { fetchTeams, totalCount } = useTeams();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTeams(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedTeam) {
      try {
        await axios.delete(`/api/teams/${selectedTeam.id}`);
        fetchTeams(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete team:", error);
      } finally {
        setShowModal(false);
        setSelectedTeam(null);
      }
    }
  };

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: Team) => router.push(`/home/teams/new-team?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: (row: Team) => router.push(`/home/teams/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: Team) => {
        setSelectedTeam(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">{t2("title")}</h1>
        <AddButton text={t2("teamsButton")} link={`/home/teams/new-team`} />
      </div>
      <Table columns={teamsColumns} data={teams} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedTeam && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete the team "${selectedTeam.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TeamsPage;
