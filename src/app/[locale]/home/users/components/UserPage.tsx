// src/app/home/users/UsersPage.tsx

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
import SearchBar from "../../../components/reusables/SearchBar";

interface UsersPageProps {
  users: (User & { team: Team | null; managedTeams: Team[] })[];
}

const UsersPage = ({ users }: UsersPageProps) => {
  const { token, user, loading } = useRequireAuth();
  const router = useRouter();
  const { fetchUsers, totalCount } = useUsers();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const t = useTranslations();
  const t2 = useTranslations("usersHeader");
  const usersColumns = [
    { header: "ID", accessor: "id" },
    { header: "Role", accessor: "role" },
    { header: "Username", accessor: "username" },
    { header: "Name", accessor: "name" },
    { header: "BCD Account", accessor: "bcdAccount" },
    { header: "EVO App ID", accessor: "evoAppId" },
    {
      header: "Team",
      accessor: (row: User & { team: Team | null; managedTeams: Team[] }) =>
        row.role === "SalesManager"
          ? row.managedTeams.map((team) => team.name).join(", ")
          : row.team?.name || "No Team",
    },
  ];

  const pageSize = 10;

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    }
  }, [token, user, loading, router]);

  useEffect(() => {
    if (token) {
      fetchUsers(currentPage, pageSize);
    }
  }, [currentPage, pageSize, fetchUsers, token]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  };

  const handleDelete = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`/api/users/${selectedUser.id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        fetchUsers(currentPage, pageSize);
      } catch (error) {
        console.error("Failed to delete user:", error);
      } finally {
        setShowModal(false);
        setSelectedUser(null);
      }
    }
  };

  const handleSearch = (searchTerm: string, searchField: string) => {
    fetchUsers(currentPage, pageSize, searchTerm, searchField);
  };

  const actions = (row: User) => [
    {
      icon: FaEdit,
      onClick: () => router.push(`/home/users/new-user?id=${row.id}`),
      className: "bg-gray-400 hover:bg-gray-500",
    },
    {
      icon: FaEye,
      onClick: () => router.push(`/home/users/${row.id}`),
      className: "bg-gray-400 hover:bg-gray-500",
    },
    {
      icon: FaTrash,
      onClick: () => {
        setSelectedUser(row);
        setShowModal(true);
      },
      className: "bg-gray-400 hover:bg-gray-500",
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
        <h1 className="text-2xl text-secondary">{t2("title")}</h1>
        {user && (user.role === "Admin" || user.role === "SalesManager") && (
          <AddButton text={t2("userButton")} link={`/home/users/new-user`} />
        )}
      </div>
      <SearchBar
        onSearch={handleSearch}
        searchFields={["username", "name", "role"]}
      />
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
