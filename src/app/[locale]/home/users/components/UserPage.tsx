"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import Table from "../../../components/reusables/Table";
import AddButton from "../../../components/reusables/AddButton";
import { User, Team } from "@prisma/client";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import Pagination from "../../../components/reusables/Pagination";
import { useUsers } from "../../../context/UserContext";
import axios from "axios";
import ConfirmationModal from "../../../components/reusables/ConfirmationModal";
import { useTranslations } from "next-intl";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

interface UsersPageProps {
  users: (User & { team: Team | null; managedTeams: Team[] })[];
  teams: Team[];
}

const UsersPage = ({ users, teams = [] }: UsersPageProps) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { fetchUsers, totalCount } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations();
  const usersColumns = [
    { header: "ID", accessor: "id" },
    { header: "Role", accessor: "role" },
    { header: "Username", accessor: "username" },
    { header: "Name", accessor: "name" },
    { header: "Mobile Number", accessor: "mobileNumber" },
    {
      header: "Team",
      accessor: (row: User & { team: Team | null; managedTeams: Team[] }) =>
        row.role === "SalesManager"
          ? row.managedTeams.map((team) => team.name).join(", ")
          : row.team?.name || "No Team",
    },
  ];
  const t2 = useTranslations("usersHeader");

  const pageSize = 10;

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, user, loading, router]);

  useEffect(() => {
    fetchUsers(currentPage, pageSize);
  }, [currentPage, pageSize, fetchUsers]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`/api/users/${selectedUser.id}`);
        fetchUsers(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        setShowModal(false);
        setSelectedUser(null);
      }
    }
  };

  const actions = [
    {
      icon: FaEdit,
      onClick: (row: User) => router.push(`/home/users/new-user?id=${row.id}`),
      className: "bg-secondary hover:bg-primary",
    },
    {
      icon: FaEye,
      onClick: (row: User) => router.push(`/home/users/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-600",
    },
    {
      icon: FaTrash,
      onClick: (row: User) => {
        setSelectedUser(row);
        setShowModal(true);
      },
      className: "bg-red-400 hover:bg-red-600",
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <div>Redirecting...</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold text-primary">{t2("title")}</h1>
        {user && (user.role === "Admin" || user.role === "SalesManager") && (
          <AddButton text={t2("userButton")} link={`/home/users/new-user`} />
        )}
      </div>
      <Table columns={usersColumns} data={users} actions={actions} />
      <Pagination
        currentPage={currentPage}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={handlePageChange}
      />
      {showModal && selectedUser && (
        <ConfirmationModal
          title="Confirm Deletion"
          content={`Are you sure you want to delete the user "${selectedUser.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default UsersPage;
