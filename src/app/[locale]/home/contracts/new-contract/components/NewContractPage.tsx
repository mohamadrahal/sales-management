"use client";
import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import { ContractType, BusinessType } from "@prisma/client";

const NewContractPage = () => {
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
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";

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
        },
      });
      router.push(`/home/contracts`);
    } catch (error) {
      console.error("Failed to create contract:", error);
      alert("Failed to create contract");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          New Contract
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <InputField
              type="number"
              name="salesmanId"
              value={form.salesmanId}
              onChange={handleInputChange}
              placeholder="Salesman ID"
            />
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
            <InputField
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleInputChange}
              placeholder="Company Name"
            />
            <select
              name="businessType"
              value={form.businessType}
              onChange={handleSelectChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={BusinessType.Retail}>Retail</option>
              <option value={BusinessType.Wholesale}>Wholesale</option>
              <option value={BusinessType.FoodService}>Food Service</option>
              <option value={BusinessType.Manufacturing}>Manufacturing</option>
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
              <option value={BusinessType.Entertainment}>Entertainment</option>
              <option value={BusinessType.NonProfit}>Non-Profit</option>
            </select>
            <InputField
              type="text"
              name="ownerName"
              value={form.ownerName}
              onChange={handleInputChange}
              placeholder="Owner Name"
            />
            <InputField
              type="text"
              name="ownerMobileNumber"
              value={form.ownerMobileNumber}
              onChange={handleInputChange}
              placeholder="Owner Mobile Number"
            />
            <InputField
              type="text"
              name="companyMobileNumber"
              value={form.companyMobileNumber}
              onChange={handleInputChange}
              placeholder="Company Mobile Number"
            />
            <InputField
              type="text"
              name="contactPersonName"
              value={form.contactPersonName}
              onChange={handleInputChange}
              placeholder="Contact Person Name"
            />
            <InputField
              type="text"
              name="contactPersonMobileNumber"
              value={form.contactPersonMobileNumber}
              onChange={handleInputChange}
              placeholder="Contact Person Mobile Number"
            />
            <InputField
              type="text"
              name="bcdAccountNumber"
              value={form.bcdAccountNumber}
              onChange={handleInputChange}
              placeholder="BCD Account Number (optional)"
            />
            <input
              type="file"
              name="document"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Contract
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewContractPage;
