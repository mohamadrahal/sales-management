"use client";
import React from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthStore from "../stores/authStore";
import useRequireAuth from "../hooks/useRequireAuth";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";
import { IoLogOut } from "react-icons/io5";

const LogoutButton = () => {
  useRequireAuth();

  const t = useTranslations("logout");

  const router = useRouter();
  const locale = Cookies.get("NEXT_LOCALE") || "en";
  const { logout, setLoading } = useAuthStore((state) => ({
    logout: state.logout,
    setLoading: state.setLoading,
  }));

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await axios.post("/api/logout", { locale });

      if (response.status === 200) {
        logout();
        window.location.href = `/${locale}/login`;
      }
    } catch (error) {
      console.error("Failed to logout:", error);
      alert("An error occurred during logout");
    }
  };

  return (
    <IoLogOut
      onClick={handleLogout}
      className="text-white cursor-pointer hover:text-primary"
      size={30}
      title={t("label")}
    />
  );
};

export default LogoutButton;
