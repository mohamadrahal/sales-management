// components/InputField.tsx
"use client";
import React from "react";

type InputFieldProps = {
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
};

const InputField = ({
  type,
  value,
  onChange,
  placeholder,
}: InputFieldProps) => {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      required
    />
  );
};

export default InputField;
