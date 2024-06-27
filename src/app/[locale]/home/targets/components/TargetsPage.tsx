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
import axios from "axios";
import { useTranslations } from "next-intl";
import { getFilterOptions, getTargetsColumns } from "../data/translation"; // Adjust the path as needed

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
  const t2 = useTranslations("targetHeader");

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

  const filterOptions = getFilterOptions(t2);

  // Update targetsColumns to dynamically set the header based on filter
  const targetsColumns = getTargetsColumns(t2, filter);

  // Adjust the filtering logic
  const filteredTargets = targets.filter((target) => {
    if (filter === "team") {
      return target.team !== null;
    } else if (filter === "salesman") {
      return target.individual !== null;
    }
    return true; // Default case if no filter is set
  });

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">{t2("title")}</h1>
        <AddButton text={t2("setTarget")} link={`/home/targets/new-target`} />
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
