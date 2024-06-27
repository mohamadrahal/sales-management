"use client";

import React, { useEffect, useState } from "react";
import { Link } from "../../../navigation";
import { useTranslations } from "next-intl";
import LogoutButton from "./LogoutButton";
import useAuthStore from "../stores/authStore";
import LocaleSwitcher from "./LocalSwitcher";

interface MenuItem {
  name: string;
  path: string;
}

const SideBar = () => {
  const { user } = useAuthStore();
  const t = useTranslations();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    let items: MenuItem[] = t.raw("menuItems");

    if (user && user.role === "Salesman") {
      items = items.filter(
        (item) =>
          item.name === "Contracts" ||
          item.name === "Branches" ||
          item.name === "Targets"
      );
    }
    setMenuItems(items);
  }, [t, user]);

  return (
    <div className="h-full w-64 bg-white text-white shadow-lg">
      <div className="p-4">
        <h2 className="text-2xl text-primary font-semibold">
          {t("sidebar.title")}
        </h2>
      </div>
      <nav className="mt-10">
        {menuItems.map((item: MenuItem) => (
          <Link
            key={item.name}
            href={item.path}
            className="block px-4 py-2 hover:bg-gray-100 text-primary text-lg"
          >
            {item.name}
          </Link>
        ))}
        <div className="w-full flex justify-center mt-4 flex-col gap-2">
          <LocaleSwitcher />
          <LogoutButton />
        </div>
      </nav>
    </div>
  );
};

export default SideBar;
