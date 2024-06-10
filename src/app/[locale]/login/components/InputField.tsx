import React, { useState } from "react";
import {
  AiOutlineMail,
  AiOutlineEye,
  AiOutlineEyeInvisible,
} from "react-icons/ai"; // Icons for email and password visibility
import { RiLockPasswordLine } from "react-icons/ri"; // Icon for password
import {
  inputContainerStyle,
  iconStyle,
  inputStyle,
} from "../../../styles/Login.styles";

type Props = {
  id: string;
  type: string;
  label: string;
  value: string;
  placeholder: string;
  onChange(e: React.ChangeEvent<HTMLInputElement>): void;
};

const InputField = ({
  id,
  label,
  onChange,
  placeholder,
  type,
  value,
}: Props) => {
  const [showPassword, setShowPassword] = useState(false);

  const renderIcon = () => {
    switch (type) {
      case "email":
        return <AiOutlineMail className="h-5 w-5 text-gray-400" />;
      case "password":
        return showPassword ? (
          <AiOutlineEyeInvisible className="h-5 w-5 text-gray-400" />
        ) : (
          <AiOutlineEye className="h-5 w-5 text-gray-400" />
        );
      default:
        return null;
    }
  };
  return (
    <div className={inputContainerStyle}>
      <label className="sr-only" htmlFor={id}>
        {label}
      </label>
      {type === "email" && <AiOutlineMail className={iconStyle} />}
      {type === "password" && <RiLockPasswordLine className={iconStyle} />}
      <input
        className={inputStyle}
        id={id}
        name={id}
        onChange={onChange}
        placeholder={placeholder}
        style={{ paddingRight: "1.3rem" }}
        type={showPassword ? "text" : type}
        value={value}
      />
      {type === "password" && (
        <button
          className="absolute inset-y-0 left-0 flex items-center pr-3"
          onClick={() => setShowPassword(!showPassword)}
          type="button"
        >
          {renderIcon()}
        </button>
      )}
    </div>
  );
};

export default InputField;
