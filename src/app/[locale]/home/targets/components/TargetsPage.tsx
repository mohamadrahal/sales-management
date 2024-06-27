// components/TargetsPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTargets } from "../../../context/TargetsContext";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import Pagination from "../../../components/reusables/Pagination";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import Filter from "../../../components/reusables/Filter";
import { Target } from "../../../../../types/types"; // Adjust the path to where your types file is located
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import { Column } from "../../../components/reusables/Table";
import axios from "axios";

type TargetsPageProps = {
  targets: Target[];
};

const TargetsPage: React.FC<TargetsPageProps> = ({ targets }) => {
  const router = useRouter();
  const { fetchTargets, totalCount, filter, setFilter } = useTargets();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  useEffect(() => {
    fetchTargets(currentPage, pageSize);
  }, [currentPage, filter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    if (selectedTarget) {
      try {
        await axios.delete(`/api/targets/${selectedTarget.id}`);
        fetchTargets(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete target:", error);
      } finally {
        setShowModal(false);
        setSelectedTarget(null);
      }
    }
  };

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: Target) =>
        router.push(`/home/targets/new-target?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: (row: Target) => router.push(`/home/targets/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: Target) => {
        setSelectedTarget(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  const filterOptions = [
    { label: "Team Targets", value: "team" },
    { label: "Salesman Targets", value: "salesman" },
  ];

  const targetsColumns: Column[] = [
    { header: "ID", accessor: "id" },
    { header: "Owner Type", accessor: "targetType" },
    {
      header: "Owner Name",
      accessor: (row: Target) => row.team?.name || row.individual?.name || "",
    },
    {
      header: filter === "team" ? "Team ID" : "Salesman ID",
      accessor: filter === "team" ? "teamId" : "individualId",
    },
    { header: "Period From", accessor: "periodFrom" },
    { header: "Period To", accessor: "periodTo" },
    { header: "Number of Contracts", accessor: "numberOfContracts" },
    { header: "Total Amount (LYD)", accessor: "totalAmountLYD" },
  ];

  const filteredTargets = targets.filter((target) =>
    filter === "team" ? target.team !== null : target.individual !== null
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">Targets</h1>
        <AddButton text="Set Target" link={`/home/targets/new-target`} />
      </div>
      <Filter
        options={filterOptions}
        selectedFilter={filter}
        onFilterChange={setFilter}
      />
      <Table
        columns={targetsColumns}
        data={filteredTargets}
        actions={actions}
      />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedTarget && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete the target for "${
            selectedTarget.team?.name || selectedTarget.individual?.name
          }"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default TargetsPage;
