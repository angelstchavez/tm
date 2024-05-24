import React from "react";
import { UseFormRegisterReturn } from "react-hook-form";

interface ComboBoxProps {
  id: string;
  label: string;
  options: { value: string; label: string }[];
  register: UseFormRegisterReturn;
  error?: string;
}

const ComboBox: React.FC<ComboBoxProps> = ({
  id,
  label,
  options,
  register,
  error,
}) => {
  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <label htmlFor={id} className="text-sm">
          {label}
        </label>
        <select
          {...register}
          id={id}
          className="pl-3 pr-10 mt-1 border focus:outline-none sm:text-sm relative inline-flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <option value="" disabled selected>
            Seleccionar
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && (
          <span className="text-red-600 text-sm font-semibold">{error}</span>
        )}
      </div>
    </div>
  );
};

export default ComboBox;
