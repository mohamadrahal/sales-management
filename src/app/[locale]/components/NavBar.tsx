"use client";

import React from "react";
import { useRouter } from "@/navigation";
import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocalSwitcher";
import { IoPersonCircle } from "react-icons/io5";
import useRequireAuth from "../hooks/useRequireAuth";

const NavBar = () => {
  const { token, user } = useRequireAuth();
  const router = useRouter();

  const handleProfileClick = () => {
    router.push("/home/profile");
  };

  return (
    <nav className="bg-secondary p-4 flex justify-between items-center shadow-xl">
      <LocaleSwitcher />
      {user && token && (
        <div className="flex items-center gap-4">
          <LogoutButton />
          <button onClick={handleProfileClick} className="text-white">
            <IoPersonCircle size={30} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
