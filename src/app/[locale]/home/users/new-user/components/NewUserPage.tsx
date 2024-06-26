// components/NewUserPage.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import { UserRole } from "@prisma/client";

const NewUserPage = () => {
  const [form, setForm] = useState({
    role: UserRole.Salesman as UserRole,
    username: "",
    password: "",
    teamId: "",
    name: "",
    mobileNumber: "",
    bcdAccount: "",
    evoAppId: "",
    nationalId: "",
  });

  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value as UserRole });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitForm = {
      ...form,
      teamId: form.teamId ? Number(form.teamId) : null,
      bcdAccount: form.bcdAccount || null,
    };

    try {
      await axios.post("/api/users", submitForm);
      router.push(`/home/users`);
    } catch (error) {
      console.error("Failed to create user:", error);
      alert("Failed to create user");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          New User
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="role"
              value={form.role}
              onChange={handleSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={UserRole.Admin}>Admin</option>
              <option value={UserRole.SalesManager}>Sales Manager</option>
              <option value={UserRole.Salesman}>Salesman</option>
            </select>
            <InputField
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder="Username"
            />
            <InputField
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Password"
            />
            <InputField
              type="number"
              name="teamId"
              value={form.teamId}
              onChange={handleInputChange}
              placeholder="Team ID"
            />
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder="Name"
            />
            <InputField
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleInputChange}
              placeholder="Mobile Number"
            />
            <InputField
              type="text"
              name="bcdAccount"
              value={form.bcdAccount}
              onChange={handleInputChange}
              placeholder="BCD Account (optional)"
            />
            <InputField
              type="text"
              name="evoAppId"
              value={form.evoAppId}
              onChange={handleInputChange}
              placeholder="EVO App ID"
            />
            <InputField
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleInputChange}
              placeholder="National ID"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create User
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUserPage;
