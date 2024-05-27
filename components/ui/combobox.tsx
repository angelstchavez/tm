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
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
