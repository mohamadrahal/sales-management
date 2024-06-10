"use client";

import React, { useState } from "react";
import { useRouter } from "../../../navigation";
import Image from "next/image";
import useAuthStore from "../store/authStore";
import InputField from "./components/InputField";
import Modal from "./components/ForgotPasswordModal";
import { getUsers } from "../../data/users";
import colors from "../../../../public/styles/colors"; // Ensure this path is correct

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  const handleModalConfirm = (code: number, password: string) => {
    console.log(code);
    console.log(password);
    setShowModal(false);
  };

  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const users: Array<User> = getUsers();
    const user = users.find(
      (user) => user.email === email && user.password === password
    );

    if (user) {
      setUser({ email: user.email, role: user.role });
      router.push("/unblock");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div
        className="z-10 w-full max-w-md space-y-8 rounded-xl p-10 shadow-lg"
        style={{ backgroundColor: colors.secondary.light }}
      >
        <div className="flex justify-center">
          <Image
            alt="Logo"
            className="h-full w-auto object-cover"
            src="/logo.jpeg"
            width={80}
            height={80}
          />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          الدخول
        </h2>
        <form className="space-y-6" onSubmit={handleLogin}>
          <InputField
            id="email"
            label="البريد الالكتروني"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="البريد الالكتروني"
            type="email"
            value={email}
          />
          <InputField
            id="password"
            label="كلمة السر"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة السر"
            type="password"
            value={password}
          />
          <button
            className="group relative flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white"
            style={{
              backgroundColor: colors.success.main,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
            type="submit"
          >
            دخول
          </button>
          <div className="text-center">
            <button
              className="text-lg font-medium"
              onClick={() => setShowModal(true)}
              style={{ color: colors.warning.main }}
              type="button"
            >
              نسيت كلمة السر؟
            </button>
          </div>
          {/* Modal for password reset */}
          {showModal && (
            <Modal
              onClose={() => setShowModal(false)}
              onConfirm={handleModalConfirm}
            />
          )}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
