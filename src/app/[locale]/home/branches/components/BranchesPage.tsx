// components/BranchesPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { Branch } from "../../../../../types/types";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useBranches } from "../../../context/BranchContext";
import axios from "axios";

type BranchesProps = {
  branches: Branch[];
};

const branchColumns = [
  { header: "ID", accessor: "id" },
  { header: "Name", accessor: "name" },
  { header: "Phone", accessor: "phone" },
  { header: "City", accessor: "city" },
  { header: "Contract ID", accessor: "contractId" }, // Add this line
];

const BranchesPage = ({ branches }: BranchesProps) => {
  const router = useRouter();
  const { fetchBranches, totalCount } = useBranches();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

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

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: Branch) =>
        router.push(`/home/branches/new-branch?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: (row: Branch) => router.push(`/home/branches/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: Branch) => {
        setSelectedBranch(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">Branches</h1>
        <AddButton text="Add Branch" link={`/home/branches/new-branch`} />
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
