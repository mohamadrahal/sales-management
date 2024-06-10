import React from "react";
import colors from "../../../../../public/styles/colors"; // Ensure this path is correct

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = ({ label, ...props }: Props) => {
  return (
    <div className="flex flex-col">
      {label && (
        <label className="mb-2" style={{ color: colors.text.dark }}>
          {label}
        </label>
      )}
      <input
        {...props}
        className={`w-full rounded-md px-4 py-2 ${props.className}`}
        style={{
          border: `1px solid ${colors.secondary.main}`,
          color: colors.text.dark,
          ...props.style,
        }}
      />
    </div>
  );
};

export default Input;
