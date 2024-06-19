import React from "react";
import { Link } from "../../../navigation";

const SideBar = () => {
  const menuItems = [
    { name: "Teams", path: "/teams" },
    { name: "Salesmen", path: "/salesmen" },
    { name: "Contracts", path: "/contracts" },
    { name: "Branches", path: "/branches" },
    { name: "Targets", path: "/targets" },
    { name: "Reports", path: "/reports" },
  ];

  return (
    <div className="h-full w-64 bg-gray-800 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-semibold">Dashboard</h2>
      </div>
      <nav className="mt-10">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className="block px-4 py-2 hover:bg-gray-700"
          >
            {item.name}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
