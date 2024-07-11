"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import { UserRole } from "@prisma/client";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";
import { useTranslations } from "next-intl";

const NewUserPage = () => {
  const [form, setForm] = useState({
    role: UserRole.Salesman as UserRole,
    username: "",
    password: "",
    teamIds: [] as number[],
    name: "",
    mobileNumber: "",
    bcdAccount: "",
    evoAppId: "",
    nationalId: "",
  });

  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const router = useRouter();

  const { user } = useRequireAuth();

  useEffect(() => {
    const fetchTeams = async () => {
      if (!user) return;

      try {
        let response;
        if (user.role === UserRole.Admin) {
          response = await axios.get("/api/teams/team-ids");
        } else if (user.role === UserRole.SalesManager) {
          response = await axios.get(`/api/teams/managed-by/${user.userId}`);
        }

        if (response && response.data) {
          setTeams(response.data);
        } else {
          console.error("No data received from fetchTeams response");
        }
      } catch (error) {
        console.error("Failed to fetch teams:", error);
      }
    };

    fetchTeams();
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    const id = Number(value);
    if (checked) {
      setForm((prevForm) => ({
        ...prevForm,
        teamIds: [...prevForm.teamIds, id],
      }));
    } else {
      setForm((prevForm) => ({
        ...prevForm,
        teamIds: prevForm.teamIds.filter((teamId) => teamId !== id),
      }));
    }
  };

  const handleSingleSelectChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      teamIds: [Number(value)],
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const submitForm = {
      ...form,
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

  const t = useTranslations("newUser");

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {user && user.role === "Admin" && (
                <option value={UserRole.Admin}>
                  {t("userTypeSelect.admin")}
                </option>
              )}
              {user && user.role === "Admin" && (
                <option value={UserRole.SalesManager}>
                  {t("userTypeSelect.manager")}
                </option>
              )}
              <option value={UserRole.Salesman}>
                {t("userTypeSelect.salesman")}
              </option>
            </select>
            {form.role === UserRole.SalesManager && (
              <div className="w-full p-2 border border-gray-300 rounded-md">
                <label className="block text-gray-700 font-bold mb-2">
                  Select Teams
                </label>
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center mb-2">
                    <input
                      type="checkbox"
                      id={`team-${team.id}`}
                      value={team.id}
                      checked={form.teamIds.includes(team.id)}
                      onChange={handleCheckboxChange}
                      className="mr-2"
                    />
                    <label htmlFor={`team-${team.id}`}>{team.name}</label>
                  </div>
                ))}
              </div>
            )}
            {form.role === UserRole.Salesman && (
              <select
                name="teamIds"
                value={form.teamIds[0]?.toString() || ""}
                onChange={handleSingleSelectChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectTeam")}</option>
                {teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              </select>
            )}
            <InputField
              type="text"
              name="username"
              value={form.username}
              onChange={handleInputChange}
              placeholder={t("username")}
              label={t("username")}
            />
            <InputField
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder={t("pass")}
              label={t("pass")}
            />
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder={t("name")}
              label={t("name")}
            />
            <InputField
              type="text"
              name="mobileNumber"
              value={form.mobileNumber}
              onChange={handleInputChange}
              placeholder={t("mobile")}
              label={t("mobile")}
            />
            <InputField
              type="text"
              name="bcdAccount"
              value={form.bcdAccount}
              onChange={handleInputChange}
              placeholder={t("bcd")}
              label={t("bcd")}
              required={false}
            />
            <InputField
              type="text"
              name="evoAppId"
              value={form.evoAppId}
              onChange={handleInputChange}
              placeholder={t("evo")}
              label={t("evo")}
            />
            <InputField
              type="text"
              name="nationalId"
              value={form.nationalId}
              onChange={handleInputChange}
              placeholder={t("nationalID")}
              label={t("nationalID")}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewUserPage;
