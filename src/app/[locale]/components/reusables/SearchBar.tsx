// components/reusables/SearchBar.tsx

"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";

type SearchBarProps = {
  onSearch: (searchTerm: string, searchField: string) => void;
  searchFields: string[];
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, searchFields }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchField, setSearchField] = useState(searchFields[0]);
  const locale = Cookies.get("NEXT_LOCALE") || "en";

  const handleSearch = () => {
    onSearch(searchTerm, searchField);
  };

  return (
    <div className={`flex mb-4 ${locale === "ar" ? "flip-horizontal" : ""}`}>
      <select
        value={searchField}
        onChange={(e) => setSearchField(e.target.value)}
        className={`p-2 border border-gray-300 ${
          locale === "ar" ? "rounded-r-md" : "rounded-l-md"
        } focus:outline-none`}
      >
        {searchFields.map((field) => (
          <option key={field} value={field}>
            {field}
          </option>
        ))}
      </select>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
        className="p-2 border border-gray-300 focus:outline-none"
      />
      <button
        onClick={handleSearch}
        className={`p-2 bg-blue-500 text-white ${
          locale === "ar" ? "rounded-l-md" : "rounded-r-md"
        } focus:outline-none`}
      >
        Search
      </button>
    </div>
  );
};

export default SearchBar;
