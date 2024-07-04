// src/components/ReportsPage.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useReports } from "../../../context/ReportsContext";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import Pagination from "../../../components/reusables/Pagination";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import SelectFilter from "../../../components/reusables/SelectFilter";
import { Report } from "../../../../../types/types"; // Adjust the path to where your types file is located
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import axios from "axios";
import { useTranslations } from "next-intl";
import { getReportsColumns } from "../data/translations"; // Adjust the path as needed
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

type ReportsPageProps = {
  reports: Report[];
};

const ReportsPage: React.FC<ReportsPageProps> = ({ reports }) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const {
    fetchReports,
    totalCount,
    reportType,
    setReportType,
    filterType,
    setFilterType,
    filterValue,
    setFilterValue,
  } = useReports();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [showModal, setShowModal] = useState(false);
  const pageSize = 10;
  const t2 = useTranslations("reportHeader");

  const reportTypeOptions = ["Contract Report", "Compensation Report"];
  const filterOptions =
    reportType === "Contract Report"
      ? [
          "Per Period",
          "Per Branch",
          "Per Branch City",
          "Per Team",
          "Per Salesman",
        ]
      : ["Per Period", "Per Team", "Per Salesman"];

  useEffect(() => {
    if (!loading) {
      if (!token) {
        router.push("/login");
      }
    }
  }, [token, user, loading, router]);

  useEffect(() => {
    fetchReports(currentPage, pageSize);
  }, [currentPage, reportType, filterType, filterValue]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDelete = async () => {
    if (selectedReport) {
      try {
        await axios.delete(`/api/reports/${selectedReport.id}`);
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

  const reportsColumns = getReportsColumns(t2, filterType);

  if (loading || !token) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl text-secondary">{t2("title")}</h1>
        <AddButton text="Issue Report" link="/home/reports/new-report" />
      </div>
      <div className="bg-gray-100 p-4 rounded-lg mb-4 flex space-x-4">
        <SelectFilter
          options={reportTypeOptions}
          selectedOption={reportType}
          onOptionChange={setReportType}
          label="Report Type"
        />
        <SelectFilter
          options={filterOptions}
          selectedOption={filterType}
          onOptionChange={setFilterType}
          label="Filter By"
        />
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
    </div>
  );
};

export default ReportsPage;
