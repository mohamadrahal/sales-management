// components/InputField.tsx
"use client";
import React from "react";

type InputFieldProps = {
  type: string;
  name?: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

const InputField = ({
  type,
  name,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      required
    />
  );
};

export default InputField;
