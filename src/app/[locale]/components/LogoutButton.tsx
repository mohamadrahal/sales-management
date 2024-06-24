"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import useAuthStore from "../stores/authStore";
import useRequireAuth from "../hooks/useRequireAuth";

const LogoutButton = () => {
  useRequireAuth();

  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";
  const { logout, setLoading } = useAuthStore((state) => ({
    logout: state.logout,
    setLoading: state.setLoading,
  }));

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/logout", { locale });

      if (response.status === 200) {
        // Force a full page reload to trigger middleware
        logout();
        window.location.href = `/${locale}/login`;
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
