// components/reusables/Filter.tsx
"use client";

import React from "react";

type FilterOption = {
  label: string;
  value: string;
};

type FilterProps = {
  options: FilterOption[];
  selectedFilter: string;
  onFilterChange: (value: string) => void;
};

const Filter: React.FC<FilterProps> = ({
  options,
  selectedFilter,
  onFilterChange,
}) => {
  return (
    <div className="mb-4 flex">
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onFilterChange(option.value)}
          className={`px-4 py-2 mr-2 ${
            selectedFilter === option.value
              ? "bg-secondary text-white"
              : "bg-gray-200 text-black"
          } rounded-md focus:outline-none`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Filter;
