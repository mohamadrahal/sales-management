// components/Login.tsx
"use client";
import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import InputField from "./InputField";
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
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-semibold mb-4">Login</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <InputField
            type="text"
            value={usernameOrMobile}
            onChange={(e) => setUsernameOrMobile(e.target.value)}
            placeholder="Username or Mobile Number"
          />
        </div>
        <div className="mb-4">
          <InputField
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
