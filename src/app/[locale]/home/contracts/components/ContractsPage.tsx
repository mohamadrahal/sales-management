"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { Contract } from "../../../../../types/types";
import { FaEye, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import { useContracts } from "../../../context/ContractContext";
import axios from "axios";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useTranslations } from "next-intl";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

type ContractsPageProps = {
  contracts: Contract[];
};

const ContractsPage: React.FC<ContractsPageProps> = ({ contracts }) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { fetchContracts, totalCount } = useContracts();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState("");
  const pageSize = 10;
  const t = useTranslations();
  const contractColumns = t.raw("contractColumns");

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      } else {
        fetchContracts(currentPage, pageSize);
      }
    }
  }, [token, user, loading, currentPage, pageSize, router, fetchContracts]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchContracts(page, pageSize);
  };

  const handleAction = async (action: string) => {
    if (selectedContract) {
      try {
        await axios.post(
          `/api/contracts/${selectedContract.id}/action`,
          { action },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        fetchContracts(currentPage, pageSize);
      } catch (error) {
        console.error(`Failed to ${action} contract:`, error);
      } finally {
        setShowModal(false);
        setSelectedContract(null);
      }
    }
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

  const getActions = (row: Contract) => {
    const commonActions = [
      {
        icon: FaEye,
        onClick: () => router.push(`/home/contracts/${row.id}`),
        className: "bg-gray-400 hover:bg-gray-600",
      },
    ];

    if (row.status === "Pending") {
      commonActions.push(
        {
          icon: FaCheck,
          onClick: () => {
            setSelectedContract(row);
            setModalAction("approve");
            setShowModal(true);
          },
          className: "bg-green-400 hover:bg-green-600",
        },
        {
          icon: FaTimes,
          onClick: () => {
            setSelectedContract(row);
            setModalAction("decline");
            setShowModal(true);
          },
          className: "bg-yellow-400 hover:bg-yellow-600",
        }
      );
    }

    commonActions.push({
      icon: FaTrash,
      onClick: () => {
        setSelectedContract(row);
        setModalAction("delete");
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    });

    if (user?.role === "Salesman") {
      return commonActions.slice(0, 1); // Only view for Salesman
    }

    return commonActions;
  };

  if (loading || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">
          {t("contractsHeader.title")}
        </h1>
        <AddButton
          text={t("contractsHeader.contractButton")}
          link={`/home/contracts/new-contract`}
        />
      </div>
      <Table columns={contractColumns} data={contracts} actions={getActions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedContract && (
        <ConfirmationModal
          title={`Confirm ${modalAction}`}
          content={`Are you sure you want to ${modalAction} the contract for "${selectedContract.companyName}"?`}
          onConfirm={
            modalAction === "delete"
              ? handleDelete
              : () => handleAction(modalAction)
          }
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default ContractsPage;
