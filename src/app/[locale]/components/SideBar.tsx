import React from "react";
import { Link } from "../../../navigation";
import { useTranslations } from "next-intl";

interface MenuItem {
  name: string;
  path: string;
}

const SideBar: React.FC = () => {
  const t = useTranslations();
  const menuItems: MenuItem[] = t.raw("menuItems");

  return (
    <div className="h-full w-64 bg-primary text-white">
      <div className="p-4">
        <h2 className="text-2xl font-semibold">{t("sidebar.title")}</h2>
      </div>
      <nav className="mt-10">
        {menuItems.map((item: MenuItem) => (
          <Link
            key={item.name}
            href={item.path}
            className="block px-4 py-2 hover:bg-secondary"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
