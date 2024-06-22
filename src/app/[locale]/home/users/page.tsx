import React from "react";
import prisma from "../../../../../prisma/client";
import Table from "../../components/reusables/Table";

const usersColumns = [
  { header: "ID", accessor: "id" },
  { header: "Role", accessor: "role" },
  { header: "Username", accessor: "username" },
  { header: "Name", accessor: "name" },
  { header: "Mobile Number", accessor: "mobileNumber" },
];

const UsersPage = async () => {
  const users = await prisma.user.findMany();

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Teams</h1>
      <Table columns={usersColumns} data={users} />
    </div>
  );
};

export default UsersPage;
