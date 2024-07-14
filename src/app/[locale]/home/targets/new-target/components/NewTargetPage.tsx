"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import { TargetType } from "@prisma/client";
import InputField from "../../../../components/reusables/InputField";
import { useTranslations } from "next-intl";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";

const NewTargetPage: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState<{
    targetType: TargetType;
    targetOwnerId: number;
    periodFrom: string;
    periodTo: string;
    numberOfContracts: number;
    totalAmountLYD?: number;
    bonusAmount: number;
    amountPerContract?: number;
  }>({
    targetType: TargetType.Team,
    targetOwnerId: 0,
    periodFrom: "",
    periodTo: "",
    numberOfContracts: 0,
    bonusAmount: 0,
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [teams, setTeams] = useState<{ id: number; name: string }[]>([]);
  const [salesmen, setSalesmen] = useState<{ id: number; name: string }[]>([]);

  const { token } = useRequireAuth();

  useEffect(() => {
    const fetchAvailableTargets = async () => {
      try {
        const response = await axios.get(`/api/targets/available`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTeams(response.data.teams);
        setSalesmen(response.data.salesmen);
      } catch (error) {
        console.error("Failed to fetch available targets:", error);
      }
    };

    if (token) {
      fetchAvailableTargets();
    }
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]:
        name === "targetOwnerId" ||
        name === "numberOfContracts" ||
        name === "totalAmountLYD" ||
        name === "bonusAmount" ||
        name === "amountPerContract" // Added for Salesman targets
          ? Number(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = { ...form };
    if (form.targetType === TargetType.Salesman) {
      delete data.totalAmountLYD; // Remove totalAmountLYD for Salesman targets
    }

    try {
      await axios.post("/api/targets", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push(`/home/targets`);
    } catch (error) {
      console.error("Failed to create target:", error);
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        const newErrors: { [key: string]: string } = {};
        error.response.data.error.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      } else {
        alert("Failed to create target");
      }
    }
  };

  const t = useTranslations("newTarget");

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <select
              name="targetType"
              value={form.targetType}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={TargetType.Team}>Team</option>
              <option value={TargetType.Salesman}>Salesman</option>
            </select>
            <select
              name="targetOwnerId"
              value={form.targetOwnerId}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>{t("selectOwner")}</option>
              {form.targetType === TargetType.Team &&
                teams.map((team) => (
                  <option key={team.id} value={team.id}>
                    {team.name}
                  </option>
                ))}
              {form.targetType === TargetType.Salesman &&
                salesmen.map((salesman) => (
                  <option key={salesman.id} value={salesman.id}>
                    {salesman.name}
                  </option>
                ))}
            </select>
            <InputField
              type="date"
              name="periodFrom"
              value={form.periodFrom}
              onChange={handleInputChange}
              placeholder={t("from")}
              label={t("from")}
              error={errors.periodFrom}
            />
            <InputField
              type="date"
              name="periodTo"
              value={form.periodTo}
              onChange={handleInputChange}
              placeholder={t("to")}
              label={t("to")}
              error={errors.periodTo}
            />
            <InputField
              type="number"
              name="numberOfContracts"
              value={form.numberOfContracts || ""}
              onChange={handleInputChange}
              placeholder={t("numberOfContracts")}
              label={t("numberOfContracts")}
              error={errors.numberOfContracts}
            />
            {form.targetType === TargetType.Team && (
              <InputField
                type="number"
                name="totalAmountLYD"
                value={form.totalAmountLYD || ""}
                onChange={handleInputChange}
                placeholder={t("total")}
                label={t("total")}
                error={errors.totalAmountLYD}
              />
            )}
            {form.targetType === TargetType.Salesman && (
              <InputField
                type="number"
                name="amountPerContract"
                value={form.amountPerContract || ""}
                onChange={handleInputChange}
                placeholder={t("amountPerContract")}
                label={t("amountPerContract")}
                error={errors.amountPerContract}
              />
            )}
            {form.targetType === TargetType.Team && (
              <InputField
                type="number"
                name="bonusAmount"
                value={form.bonusAmount || ""}
                onChange={handleInputChange}
                placeholder={t("bonus")}
                label={t("bonus")}
                error={errors.bonusAmount}
              />
            )}
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

export default NewTargetPage;
