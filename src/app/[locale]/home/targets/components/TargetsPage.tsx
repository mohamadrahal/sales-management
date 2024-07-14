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
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

type TargetsPageProps = {
  targets: Target[];
};

const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const TargetsPage: React.FC<TargetsPageProps> = ({ targets }) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { fetchTargets, totalCount, filter, setFilter } = useTargets();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTarget, setSelectedTarget] = useState<Target | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;
  const t2 = useTranslations("targetHeader");

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, loading, router]);

  useEffect(() => {
    fetchTargets(currentPage, pageSize);
  }, [currentPage, filter, fetchTargets]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchTargets(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedTarget) {
      try {
        await axios.delete(`/api/targets/${selectedTarget.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchTargets(currentPage, pageSize); // Fetch the updated list
      } catch (error) {
        console.error("Failed to delete target:", error);
      } finally {
        setShowModal(false);
        setSelectedTarget(null);
      }
    }
  };

  const getActions = (row: Target) => [
    {
      icon: FaEdit,
      onClick: () => router.push(`/home/targets/new-target?id=${row.id}`),
      className: "bg-gray-400 hover:bg-gray-500",
    },
    {
      icon: FaTrash,
      onClick: () => {
        setSelectedTarget(row);
        setShowModal(true);
      },
      className: "bg-gray-400 hover:bg-gray-500",
    },
  ];

  const filterOptions = getFilterOptions(t2);

  const targetsColumns = getTargetsColumns(t2, filter).map((column) => {
    if (column.accessor === "periodFrom" || column.accessor === "periodTo") {
      return {
        ...column,
        Cell: ({ value }: { value: string }) => formatDate(value),
      };
    }
    return column;
  });

  const filteredTargets = targets.filter((target) => {
    if (filter === "team") {
      return target.team !== null;
    } else if (filter === "salesman") {
      return target.individual !== null;
    }
    return true;
  });

  if (loading || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-secondary">{t2("title")}</h1>
        <AddButton text={t2("setTarget")} link={`/home/targets/new-target`} />
      </div>
      <div className="bg-gray-100 p-4 rounded-md mb-4 flex space-x-4">
        <Filter
          options={filterOptions}
          selectedFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
      <Table
        columns={targetsColumns}
        data={filteredTargets}
        actions={getActions}
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
