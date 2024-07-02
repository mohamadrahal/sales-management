"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { Branch } from "../../../../../types/types";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useBranches } from "../../../context/BranchContext";
import axios from "axios";
import { useTranslations } from "next-intl";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

type BranchesProps = {
  branches: Branch[];
};

const BranchesPage: React.FC<BranchesProps> = ({ branches }) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { fetchBranches, totalCount } = useBranches();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;
  const t = useTranslations();
  const branchColumns = t.raw("branchColumns");
  const t2 = useTranslations("branchHeader");

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      } else {
        fetchBranches(currentPage, pageSize);
      }
    }
  }, [token, user, loading, currentPage, pageSize, router, fetchBranches]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBranches(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedBranch) {
      try {
        await axios.delete(`/api/branches/${selectedBranch.id}`);
        fetchBranches(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete branch:", error);
      } finally {
        setShowModal(false);
        setSelectedBranch(null);
      }
    }
  };

  const actions = (row: Branch) => [
    {
      icon: FaEdit,
      onClick: () => router.push(`/home/branches/new-branch?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: () => router.push(`/home/branches/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: () => {
        setSelectedBranch(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  if (loading || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-secondary">{t2("title")}</h1>
        <AddButton
          text={t2("branchButton")}
          link={`/home/branches/new-branch`}
        />
      </div>
      <Table columns={branchColumns} data={branches} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedBranch && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete the branch "${selectedBranch.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default BranchesPage;
