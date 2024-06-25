"use client";
import React, { ChangeEventHandler } from "react";
import InputField from "../../../../components/reusables/InputField";

type BranchFieldsProps = {
  branch: {
    name: string;
    phone: string;
    city: string;
    locationX: number;
    locationY: number;
  };
  handleBranchChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
  addBranch: () => void;
};

const BranchFields = ({
  branch,
  handleBranchChange,
  addBranch,
}: BranchFieldsProps) => {
  return (
    <>
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
        <option value="Tripoli">Tripoli</option>
        <option value="Benghazi">Benghazi</option>
        <option value="Misrata">Misrata</option>
        <option value="Bayda">Bayda</option>
        <option value="Zawiya">Zawiya</option>
        <option value="Khoms">Khoms</option>
        <option value="Tobruk">Tobruk</option>
        <option value="Ajdabiya">Ajdabiya</option>
        <option value="Sebha">Sebha</option>
        <option value="Sirte">Sirte</option>
        <option value="Derna">Derna</option>
        <option value="Zliten">Zliten</option>
        <option value="Sabratha">Sabratha</option>
        <option value="Ghat">Ghat</option>
        <option value="Jalu">Jalu</option>
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
    </>
  );
};

export default BranchFields;
