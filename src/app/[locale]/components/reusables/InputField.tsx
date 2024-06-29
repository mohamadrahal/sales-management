// components/InputField.tsx
"use client";
import React from "react";

type InputFieldProps = {
  type: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  label: string; // Add label prop
};

const InputField = ({
  type,
  name,
  value,
  onChange,
  placeholder,
  readOnly = false,
  label,
}: InputFieldProps) => {
  return (
    <div className="mb-1">
      <label className="block text-gray-700 font-bold mb-2">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
};

export default InputField;
