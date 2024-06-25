// components/ContractPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { Contract } from "../../../../../types/types";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import { useContracts } from "../../../context/ContractContext";
import axios from "axios";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useTranslations } from "next-intl";

type ContractPageProps = {
  contracts: Contract[];
};

// const contractColumns = [
//   { header: "ID", accessor: "id" },
//   { header: "Company Name", accessor: "companyName" },
//   { header: "Owner Name", accessor: "ownerName" },
//   { header: "Status", accessor: "status" },
//   { header: "Number of Branches", accessor: "numberOfBranches" },
// ];

const ContractsPage = ({ contracts }: ContractPageProps) => {
  const router = useRouter();
  const { fetchContracts, totalCount } = useContracts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchContracts(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedContract) {
      try {
        await axios.delete(`/api/contracts/${selectedContract.id}`);
        fetchContracts(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete contract:", error);
      } finally {
        setShowModal(false);
        setSelectedContract(null);
      }
    }
  };

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: Contract) =>
        router.push(`/home/contracts/new-contract?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: (row: Contract) => router.push(`/home/contracts/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: Contract) => {
        setSelectedContract(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  const t = useTranslations();
  const contractColumns = t.raw("contractColumns");

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">{t("contractsHeader.title")}</h1>
        <AddButton text={t("contractsHeader.contractButton")} link={`/home/contracts/new-contract`} />
      </div>
      <Table columns={contractColumns} data={contracts} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedContract && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete the contract for "${selectedContract.companyName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ContractsPage;
