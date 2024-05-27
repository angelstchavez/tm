import React, { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Cookies from "js-cookie";

interface ComboboxFetchProps {
  id: string;
  label: string;
  endpoint: string;
  register: UseFormRegisterReturn;
  error?: string;
  displayFormat?: (item: any) => string; // Nueva propiedad para definir el formato de visualización
}

const ComboboxFetch: React.FC<ComboboxFetchProps> = ({
  id,
  label,
  endpoint,
  register,
  error,
  displayFormat,
}) => {
  const [options, setOptions] = useState<{ value: string; label: string }[]>(
    []
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData = JSON.parse(cookieValue);
        const token = cookieData.data.token;

        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${endpoint}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const formattedOptions = responseData.data.map((item: any) => ({
          value: item.id,
          label: displayFormat ? displayFormat(item) : item.name,
        }));

        setOptions(formattedOptions);
      } catch (error: any) {
        setFetchError(error.message);
      }
    };

    fetchData();
  }, [endpoint, displayFormat]);

  return (
    <div className="mb-4">
      <div className="flex flex-col">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
        {fetchError && (
          <span className="text-red-600 text-sm font-semibold">
            {fetchError}
          </span>
        )}
      </div>
    </div>
  );
};

export default ComboboxFetch;
