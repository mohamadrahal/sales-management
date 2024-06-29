"use client";

import React from "react";
import LogoutButton from "../components/LogoutButton";
import LocaleSwitcher from "../components/LocalSwitcher";
import { IoPersonCircle } from "react-icons/io5";
import useRequireAuth from "../hooks/useRequireAuth";

const NavBar = () => {
  const { token, user } = useRequireAuth();

  return (
    <nav className="bg-secondary p-4 flex justify-between items-center shadow-lg">
      <LocaleSwitcher />
      {user && token && (
        <div className="flex items-center gap-4">
          <LogoutButton />
          <button className="text-white">
            <IoPersonCircle size={30} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
