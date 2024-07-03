// src/components/reusables/SelectFilter.tsx

"use client";

import React from "react";

interface SelectFilterProps {
  options: string[];
  selectedOption: string;
  onOptionChange: (value: string) => void;
  label: string;
}

const SelectFilter: React.FC<SelectFilterProps> = ({
  options,
  selectedOption,
  onOptionChange,
  label,
}) => {
  return (
    <div className="mb-4">
      <label className="block mb-2">{label}</label>
      <select
        value={selectedOption}
        onChange={(e) => onOptionChange(e.target.value)}
        className="block appearance-none w-full bg-gray-200 px-4 py-2 pr-8 rounded leading-tight focus:outline-none "
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectFilter;
