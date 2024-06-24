// components/Login.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "../../components/reusables/InputField";
import axios from "axios";
import useAuthStore from "../../stores/authStore";

const Login = () => {
  const [usernameOrMobile, setUsernameOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = searchParams.get("locale") || "en";
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
        router.push(`/${locale}/home/teams`);
      }
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Login
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <InputField
              type="text"
              value={usernameOrMobile}
              onChange={(e) => setUsernameOrMobile(e.target.value)}
              placeholder="Username or Mobile Number"
            />
          </div>
          <div className="mb-6">
            <InputField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
