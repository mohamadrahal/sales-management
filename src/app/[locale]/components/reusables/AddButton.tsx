"use client";

import React from "react";
import { Link } from "@/navigation";

type Props = {
  text: string;
  link: string;
};

const AddButton = ({ text, link }: Props) => {
  return (
    <Link
      href={link}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {text}
    </Link>
  );
};

export default AddButton;
