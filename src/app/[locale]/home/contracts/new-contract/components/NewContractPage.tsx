"use client";
import React, { useState } from "react";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import InputField from "../../../../components/reusables/InputField";
import {
  ContractType,
  BusinessType,
  Status,
  BranchFormData,
  City,
} from "../../../../../../../types/types";

interface ContractForm {
  salesmanId: string;
  type: ContractType;
  companyName: string;
  businessType: BusinessType;
  ownerName: string;
  ownerMobileNumber: string;
  companyMobileNumber: string;
  contactPersonName: string;
  contactPersonMobileNumber: string;
  bcdAccountNumber: string; // changed to string
  numberOfBranches: number;
  documentPath: string;
  status: Status;
  branches: BranchFormData[];
}

const NewContractPage = () => {
  const [form, setForm] = useState<ContractForm>({
    salesmanId: "",
    type: ContractType.Subagent,
    companyName: "",
    businessType: BusinessType.Retail,
    ownerName: "",
    ownerMobileNumber: "",
    companyMobileNumber: "",
    contactPersonName: "",
    contactPersonMobileNumber: "",
    bcdAccountNumber: "", // default value set
    numberOfBranches: 1,
    documentPath: "",
    status: Status.Pending,
    branches: [],
  });

  const [branch, setBranch] = useState<BranchFormData>({
    name: "",
    phone: "",
    city: City.Tripoli,
    locationX: 0,
    locationY: 0,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleBranchChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setBranch({ ...branch, [name]: value });
  };

  const addBranch = () => {
    setForm({ ...form, branches: [...form.branches, branch] });
    setBranch({
      name: "",
      phone: "",
      city: City.Tripoli,
      locationX: 0,
      locationY: 0,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("/api/contracts", form);
      router.push(`/${locale}/home/contracts`);
    } catch (error) {
      console.error("Failed to create contract:", error);
      alert("Failed to create contract");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          New Contract
        </h1>
        <form onSubmit={handleSubmit}>
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
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(ContractType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(BusinessType).map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
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
          <InputField
            type="number"
            name="numberOfBranches"
            value={form.numberOfBranches}
            onChange={handleInputChange}
            placeholder="Number of Branches"
          />
          <InputField
            type="text"
            name="documentPath"
            value={form.documentPath}
            onChange={handleInputChange}
            placeholder="Document Path"
          />
          <select
            name="status"
            value={form.status}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(Status).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <h2 className="text-xl font-bold text-center mb-4 text-gray-800">
            Branches
          </h2>
          <InputField
            type="text"
            name="name"
            value={branch.name}
            onChange={handleBranchChange}
            placeholder="Branch Name"
          />
          <InputField
            type="text"
            name="phone"
            value={branch.phone}
            onChange={handleBranchChange}
            placeholder="Branch Phone"
          />
          <select
            name="city"
            value={branch.city}
            onChange={handleBranchChange}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Object.values(City).map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          <InputField
            type="number"
            name="locationX"
            value={branch.locationX}
            onChange={handleBranchChange}
            placeholder="Location X"
          />
          <InputField
            type="number"
            name="locationY"
            value={branch.locationY}
            onChange={handleBranchChange}
            placeholder="Location Y"
          />
          <button
            type="button"
            onClick={addBranch}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          >
            Add Branch
          </button>
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
