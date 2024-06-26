"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import useAuthStore from "../../stores/authStore";
import Cookies from "js-cookie";
import { useTranslations } from "next-intl";

const Login = () => {
  const [usernameOrMobile, setUsernameOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const locale = Cookies.get("NEXT_LOCALE") || "en";
  const { setUser, setLoading } = useAuthStore((state) => ({
    setUser: state.setUser,
    setLoading: state.setLoading,
  }));

  useEffect(() => {
    setLoading(true);
  }, [setLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/login", {
        usernameOrMobile,
        password,
        locale,
      });

      if (response.status === 200) {
        const user = response.data.user;
        setUser(user); // Set the user in the store
        const redirectPath =
          user.role === "Salesman" ? "/home/contracts" : "/home/teams";
        router.push(`/${locale}${redirectPath}`);
      }
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Invalid credentials");
    }
  };

  const t = useTranslations("loginPage");

  return (
    <div className=" w-full h-full flex items-center justify-center bg-blue-600">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-900">
          {t("title")}
        </h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">{t("email")}</label>
            <input
              type="text"
              value={usernameOrMobile}
              onChange={(e) => setUsernameOrMobile(e.target.value)}
              placeholder={t("emailPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700">{t("pass")}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t("passPlaceholder")}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <a href="#" className="text-sm text-blue-500 mt-2 inline-block">
              {t("forget")}
            </a>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {t("button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
