"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "../../../context/ReportsContext";
import Table from "../../../components/reusables/Table";
import Pagination from "../../../components/reusables/Pagination";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { Report } from "../../../../../types/types"; // Adjust the path to where your types file is located
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslations } from "next-intl";
import { getReportsColumns } from "../data/translations"; // Adjust the path as needed
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";
import IssueReportModal from "./IssueReportModal";

const ReportsPage: React.FC = () => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { reports, fetchReports, totalCount, currentPage, setCurrentPage } =
    useReports();
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showIssueModal, setShowIssueModal] = useState(false);
  const pageSize = 10;
  const t2 = useTranslations("reportHeader");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchReports(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedReport) {
      try {
        await axios.delete(`/api/reports/${selectedReport.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchReports(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete report:", error);
      } finally {
        setShowModal(false);
        setSelectedReport(null);
      }
    }
  };

  const getActions = (row: Report) => [
    {
      icon: FaEdit,
      onClick: () => router.push(`/home/reports/edit-report?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: () => router.push(`/home/reports/view-report?id=${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: () => {
        setSelectedReport(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  const reportsColumns = getReportsColumns(t2);

  if (loading || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-secondary">{t2("title")}</h1>
        <button
          onClick={() => setShowIssueModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          {t2("issueReport")}
        </button>
      </div>
      <Table columns={reportsColumns} data={reports} actions={getActions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedReport && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete this report?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
      {showIssueModal && (
        <IssueReportModal onClose={() => setShowIssueModal(false)} />
      )}
    </div>
  );
};

export default ReportsPage;
