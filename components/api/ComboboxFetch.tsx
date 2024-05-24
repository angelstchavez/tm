import React, { useEffect, useState } from "react";
import { UseFormRegisterReturn } from "react-hook-form";
import Cookies from "js-cookie";

interface ComboboxFetchProps {
  id: string;
  label: string;
  endpoint: string;
  register: UseFormRegisterReturn;
  error?: string;
}

const ComboboxFetch: React.FC<ComboboxFetchProps> = ({
  id,
  label,
  endpoint,
  register,
  error,
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

        const formattedOptions = responseData.data.map(
          (item: { id: string; name: string }) => ({
            value: item.id,
            label: item.name,
          })
        );

        setOptions(formattedOptions);
      } catch (error: any) {
        setFetchError(error.message);
      }
    };

    fetchData();
  }, [endpoint]);

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
