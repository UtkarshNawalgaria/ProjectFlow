import { ChangeEvent } from "react";
import { TError } from "../../services/client";

const FieldGroup = ({
  inputType,
  error,
  label,
  inputValue,
  inputName,
  onValueChange,
  required,
  placeholder,
}: {
  inputType: string;
  label: string;
  inputValue: string;
  inputName: string;
  placeholder?: string;
  required?: boolean;
  error?: TError;
  onValueChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <div className="flex flex-col gap-[5px] mb-8">
      <label className="block text-md font-medium text-grey-dark mb-1">
        {label}
      </label>
      <input
        type={inputType}
        name={inputName}
        id={inputName}
        value={inputValue}
        onChange={(e) => onValueChange(e)}
        className={`rounded-md border focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full placeholder:text-gray-300 ${
          error ? "border-error" : null
        }`}
        placeholder={placeholder ?? ""}
        required={required ?? false}
      />
      {typeof error === "object" && inputName in error ? (
        <span className="text-sm text-red-600">{error[inputName][0]}</span>
      ) : null}
    </div>
  );
};

export default FieldGroup;
