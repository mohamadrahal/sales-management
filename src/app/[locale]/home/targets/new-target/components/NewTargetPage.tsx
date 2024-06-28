"use client";

import React, { useState } from "react";
import { useRouter } from "@/navigation";
import axios from "axios";
import { TargetType } from "@prisma/client";
import InputField from "../../../../components/reusables/InputField";

const NewTargetPage: React.FC = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    targetType: TargetType.Team as TargetType,
    targetOwnerId: 0,
    periodFrom: "",
    periodTo: "",
    numberOfContracts: 0,
    totalAmountLYD: 0,
    bonusAmount: 0, // Optional field
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
        name === "bonusAmount"
          ? Number(value)
          : value,
    }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (
      form.targetType === TargetType.Team &&
      (!form.bonusAmount || form.bonusAmount <= 0)
    ) {
      newErrors.bonusAmount = "Bonus amount is required for team targets";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("/api/targets", form);
      router.push(`/home/targets`);
    } catch (error) {
      console.error("Failed to create target:", error);
      alert("Failed to create target");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center">
      <div className="w-full bg-white p-8 rounded-lg shadow-md mx-8 my-4">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          New Target
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
            <InputField
              type="number"
              name="targetOwnerId"
              value={form.targetOwnerId || ""}
              onChange={handleInputChange}
              placeholder="Owner ID"
            />
            <InputField
              type="date"
              name="periodFrom"
              value={form.periodFrom}
              onChange={handleInputChange}
              placeholder="Period From"
            />
            <InputField
              type="date"
              name="periodTo"
              value={form.periodTo}
              onChange={handleInputChange}
              placeholder="Period To"
            />
            <InputField
              type="number"
              name="numberOfContracts"
              value={form.numberOfContracts || ""}
              onChange={handleInputChange}
              placeholder="Number of Contracts"
            />
            <InputField
              type="number"
              name="totalAmountLYD"
              value={form.totalAmountLYD || ""}
              onChange={handleInputChange}
              placeholder="Total Amount (LYD)"
            />
            {form.targetType === TargetType.Team && (
              <InputField
                type="number"
                name="bonusAmount"
                value={form.bonusAmount || ""}
                onChange={handleInputChange}
                placeholder="Bonus Amount"
              />
            )}
            {errors.bonusAmount && (
              <p className="text-red-500">{errors.bonusAmount}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Create Target
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewTargetPage;
