"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { teamSchema, cityEnum, City } from "@/app/schemas/teamSchema";

const NewTeam = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState<City>(cityEnum.options[0]);
  const router = useRouter(); // Ensure useRouter is called inside the component
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const teamData = { name, location };
    const validation = teamSchema.safeParse(teamData);

    if (!validation.success) {
      alert("Invalid data");
      return;
    }

    try {
      const response = await axios.post("/api/teams", teamData);

      if (response.status === 201) {
        router.push(`/${locale}/teams`);
      } else {
        alert("Failed to add team");
      }
    } catch (error) {
      console.error("Failed to submit form", error);
      alert("Failed to submit form");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Add New Team</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Location
          </label>
          <select
            value={location}
            onChange={(e) => setLocation(e.target.value as City)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          >
            {cityEnum.options.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Add Team
        </button>
      </form>
    </div>
  );
};

export default NewTeam;
