"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import { ContractType, BusinessType } from "@prisma/client";
import useRequireAuth from "@/app/[locale]/hooks/useRequireAuth";
import { useTranslations } from "next-intl";

const NewContractPage = () => {
  const { user, token } = useRequireAuth();
  const [form, setForm] = useState({
    salesmanId: "",
    type: ContractType.Subagent as ContractType,
    companyName: "",
    businessType: BusinessType.Retail as BusinessType,
    ownerName: "",
    ownerMobileNumber: "",
    companyMobileNumber: "",
    contactPersonName: "",
    contactPersonMobileNumber: "",
    bcdAccountNumber: "",
    status: "Pending",
  });
  const [document, setDocument] = useState<File | null>(null);

  const router = useRouter();

  useEffect(() => {
    if (user) {
      setForm((prevForm) => ({
        ...prevForm,
        salesmanId: user.userId.toString(),
      }));
    }
  }, [user]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value as ContractType | BusinessType });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocument(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      formData.append(key, value);
    });
    if (document) {
      formData.append("document", document);
    }

    try {
      await axios.post("/api/contracts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      router.push(`/home/contracts`);
    } catch (error) {
      console.error("Failed to create contract:", error);
      alert("Failed to create contract");
    }
  };

  const t = useTranslations("newContract");

  return (
    <div className=" w-full flex">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-8">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          {t("title")}
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-3">
            <InputField
              type="number"
              name="salesmanId"
              value={form.salesmanId}
              onChange={handleInputChange}
              placeholder={t("id")}
              readOnly
              label={t("id")}
            />
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2">
                {t("contractType.contractTitle")}
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleSelectChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={ContractType.Subagent}>Subagent</option>
                <option value={ContractType.Merchant}>Merchant</option>
                <option value={ContractType.Both}>Both</option>
              </select>
            </div>
            <InputField
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              placeholder={t("companyName")}
              label={t("companyName")}
            />
            <div className="mb-1">
              <label className="block text-gray-700 font-bold mb-2">
                {t("businessType")}
              </label>
              <select
                name="businessType"
                value={form.businessType}
                onChange={handleSelectChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={BusinessType.Retail}>Retail</option>
                <option value={BusinessType.Wholesale}>Wholesale</option>
                <option value={BusinessType.FoodService}>Food Service</option>
                <option value={BusinessType.Manufacturing}>
                  Manufacturing
                </option>
                <option value={BusinessType.Technology}>Technology</option>
                <option value={BusinessType.Healthcare}>Healthcare</option>
                <option value={BusinessType.FinancialServices}>
                  Financial Services
                </option>
                <option value={BusinessType.RealEstate}>Real Estate</option>
                <option value={BusinessType.Education}>Education</option>
                <option value={BusinessType.Transportation}>
                  Transportation
                </option>
                <option value={BusinessType.Entertainment}>
                  Entertainment
                </option>
                <option value={BusinessType.NonProfit}>Non-Profit</option>
              </select>
            </div>
            <InputField
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleInputChange}
              placeholder={t("ownerName")}
              label={t("ownerName")}
            />
            <InputField
              type="text"
              name="ownerMobileNumber"
              value={form.ownerMobileNumber}
              onChange={handleInputChange}
              placeholder={t("ownerMobile")}
              label={t("ownerMobile")}
            />
            <InputField
              type="text"
              name="companyMobileNumber"
              value={form.companyMobileNumber}
              onChange={handleInputChange}
              placeholder={t("companyMobile")}
              label={t("companyMobile")}
            />
            <InputField
              type="text"
              name="contactPersonName"
              value={form.contactPersonName}
              onChange={handleInputChange}
              placeholder={t("contactPersonName")}
              label={t("contactPersonName")}
            />
            <InputField
              type="text"
              name="contactPersonMobileNumber"
              value={form.contactPersonMobileNumber}
              onChange={handleInputChange}
              placeholder={t("contactPersonMobile")}
              label={t("contactPersonMobile")}
            />
            <InputField
              type="text"
              name="bcdAccountNumber"
              value={form.bcdAccountNumber}
              onChange={handleInputChange}
              placeholder={t("bcd")}
              label={t("bcd")}
            />
            <div className="mb-4">
              <label className="block text-gray-700 font-bold mb-2">
              {t("document")}
              </label>
              <input
                type="file"
                name="document"
                onChange={handleFileChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
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

export default NewContractPage;
