import React from "react";
import Input from "./ForgotPasswordInput";
import colors from "../../../../../public/styles/colors";
import { modalBackdropStyle, modalStyle } from "../../../styles/Login.styles";

const inputConfigs = [
  {
    id: "code",
    label: "Code",
    placeholder: "Enter code",
    type: "text",
  },
  {
    id: "password",
    label: "New Password",
    placeholder: "New Password",
    type: "password",
  },
  {
    id: "confirmPassword",
    label: "Confirm Password",
    placeholder: "Confirm Password",
    type: "password",
  },
];

function Modal({ onClose, onConfirm }: any) {
  const [values, setValues] = React.useState<Record<string, string>>({
    code: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (id: string, value: string) => {
    setValues((prevValues) => ({ ...prevValues, [id]: value }));
  };

  const handleConfirm = () => {
    if (values.password === values.confirmPassword) {
      onConfirm(values);
    } else {
      alert("Passwords do not match");
    }
  };

  const buttonConfigs = [
    {
      text: "Cancel",
      onClick: onClose,
      bgColor: colors.warning.main,
      textColor: colors.text.light,
    },
    {
      text: "Confirm",
      onClick: handleConfirm,
      bgColor: colors.success.main,
      textColor: colors.text.light,
    },
  ];

  return (
    <div className={modalBackdropStyle}>
      <div className={modalStyle}>
        <h3 className="text-center text-lg font-medium text-gray-900">
          إعادة تعيين كلمة السر
        </h3>
        {inputConfigs.map(({ id, label, ...inputProps }) => (
          <Input
            key={id}
            label={label}
            {...inputProps}
            value={values[id]}
            onChange={(e) => handleInputChange(id, e.target.value)}
          />
        ))}
        <div className="flex justify-end">
          {buttonConfigs.map(({ text, onClick, bgColor, textColor }, index) => (
            <button
              key={index}
              className="rounded-md px-4 py-2 ml-2"
              onClick={onClick}
              style={{ backgroundColor: bgColor, color: textColor }}
            >
              {text}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Modal;
