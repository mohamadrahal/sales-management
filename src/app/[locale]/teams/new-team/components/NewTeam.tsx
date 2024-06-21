"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { teamSchema, cityEnum, City } from "@/app/schemas/teamSchema";
import { useTeams } from "@/app/[locale]/context/TeamsContext";

const NewTeam: React.FC = () => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState<City>(cityEnum.options[0]);
  const [isEditing, setIsEditing] = useState(false);
  const { teams, addTeam, fetchTeams } = useTeams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";
  const teamId = searchParams.get("id");

  useEffect(() => {
    if (teamId) {
      const team = teams.find((t) => t.id === parseInt(teamId));
      if (team) {
        setName(team.name);
        setLocation(team.location as City); // Ensure correct type casting
        setIsEditing(true);
      }
    }
  }, [teamId, teams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const teamData = { name, location };
    const validation = teamSchema.safeParse(teamData);

    if (!validation.success) {
      alert("Invalid data");
      return;
    }

    try {
      if (isEditing && teamId) {
        const response = await axios.put(`/api/teams/${teamId}`, teamData);
        if (response.status === 200) {
          fetchTeams(1, 10);
          router.push(`/${locale}/teams`);
        } else {
          alert("Failed to update team");
        }
      } else {
        const response = await axios.post("/api/teams", teamData);
        if (response.status === 201) {
          addTeam(response.data);
          router.push(`/${locale}/teams`);
        } else {
          alert("Failed to add team");
        }
      }
    } catch (error) {
      console.error("Failed to submit form", error);
      alert("Failed to submit form");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        {isEditing ? "Edit Team" : "Add New Team"}
      </h1>
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
            onChange={(e) => setLocation(e.target.value as City)} // Correct type assignment
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
          {isEditing ? "Update Team" : "Add Team"}
        </button>
      </form>
    </div>
  );
};

export default NewTeam;
