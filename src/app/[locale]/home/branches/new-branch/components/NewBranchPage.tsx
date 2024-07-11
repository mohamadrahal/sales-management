"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import { City, Contract } from "@prisma/client";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";
import { useTranslations } from "next-intl";

const NewBranchPage = () => {
  const [form, setForm] = useState({
    contractId: "",
    name: "",
    phone: "",
    city: City.Tripoli as City,
    locationX: 0,
    locationY: 0,
  });
  const [contracts, setContracts] = useState<Contract[]>([]);
  const router = useRouter();
  const { token } = useRequireAuth();

  useEffect(() => {
    const fetchContracts = async () => {
      try {
        const response = await axios.get("/api/contracts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setContracts(response.data.contracts);
      } catch (error) {
        console.error("Failed to fetch contracts:", error);
      }
    };

    fetchContracts();
  }, [token]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value as City });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const parsedForm = {
      ...form,
      contractId: parseInt(form.contractId, 10),
      locationX: parseFloat(form.locationX.toString()),
      locationY: parseFloat(form.locationY.toString()),
    };

    try {
      await axios.post("/api/branches", parsedForm, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      router.push(`/home/branches`);
    } catch (error) {
      console.error("Failed to create branch:", error);
      alert("Failed to create branch");
    }
  };

  const t = useTranslations("newBranch");

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
         {t("title")}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2">
                {t("contractID")}
              </label>
              <select
                name="contractId"
                value={form.contractId}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">{t("selectContract")}</option>
                {contracts.map((contract) => (
                  <option key={contract.id} value={contract.id}>
                    {contract.id} - {contract.companyName}
                  </option>
                ))}
              </select>
            </div>
            <InputField
              type="text"
              name="name"
              value={form.name}
              onChange={handleInputChange}
              placeholder={t("branchName")}
              label={t("branchName")}
            />
            <InputField
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleInputChange}
              placeholder={t("phone")}
              label={t("phone")}
            />
            <select
              name="city"
              value={form.city}
              onChange={handleSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={City.Tripoli}>Tripoli</option>
              <option value={City.Benghazi}>Benghazi</option>
              <option value={City.Misrata}>Misrata</option>
              <option value={City.Bayda}>Bayda</option>
              <option value={City.Zawiya}>Zawiya</option>
              <option value={City.Khoms}>Khoms</option>
              <option value={City.Tobruk}>Tobruk</option>
              <option value={City.Ajdabiya}>Ajdabiya</option>
              <option value={City.Sebha}>Sebha</option>
              <option value={City.Sirte}>Sirte</option>
              <option value={City.Derna}>Derna</option>
              <option value={City.Zliten}>Zliten</option>
              <option value={City.Sabratha}>Sabratha</option>
              <option value={City.Ghat}>Ghat</option>
              <option value={City.Jalu}>Jalu</option>
            </select>
            <InputField
              type="number"
              name="locationX"
              value={form.locationX}
              onChange={handleInputChange}
              placeholder={t("locationx")}
              label={t("locationx")}
            />
            <InputField
              type="number"
              name="locationY"
              value={form.locationY}
              onChange={handleInputChange}
              placeholder={t("locationy")}
              label={t("locationy")}
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

export default NewBranchPage;
