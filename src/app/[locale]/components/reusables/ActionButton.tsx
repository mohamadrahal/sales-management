"use client";

import React from "react";
import { IconType } from "react-icons";

interface ActionButtonProps {
  icon: IconType;
  onClick: () => void;
  className?: string;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  onClick,
  className,
}) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1 text-sm font-semibold text-white rounded ${className}`}
    >
      <Icon className="w-3 h-6" />
    </button>
  );
};

export default ActionButton;
