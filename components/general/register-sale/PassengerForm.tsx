import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import ComboBox from "@/components/ui/combobox";
import { DocumentTypes } from "@/utilities/types";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { FaSearch } from "react-icons/fa";

const PassengerFormSchema = z.object({
  names: z.string().nonempty("Introduce un nombre válido."),
  surnames: z.string().nonempty("Introduce un apellido válido."),
  identificationType: z
    .string()
    .nonempty("Selecciona un tipo de documento válido."),
  identificationNumber: z
    .string()
    .nonempty("Introduce un número de documento válido.")
    .refine((value) => /^\d{5,10}$/.test(value), {
      message: "Debe tener entre 5 y 10 dígitos.",
    }),
});

type PassengerFormInputs = z.infer<typeof PassengerFormSchema>;

interface PassengerFormProps {
  seatNumber: number;
  onSubmit: (data: PassengerFormInputs) => void;
  onFormValidityChange: (isValid: boolean, seatNumber: number) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  seatNumber,
  onSubmit,
  onFormValidityChange,
}) => {
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    formState: { isValid },
    setValue,
  } = useForm<PassengerFormInputs>({
    resolver: zodResolver(PassengerFormSchema),
    mode: "onChange",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [searchIdentificationNumber, setSearchIdentificationNumber] =
    useState("");
  const [passengerData, setPassengerData] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [isSearching, setIsSearching] = useState(false); // Variable para controlar el estado del botón de búsqueda

  const fetchData = async () => {
    setIsSearching(true); // Desactivar el botón de búsqueda al comenzar la búsqueda
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/passenger/get-by-identification-number/${searchIdentificationNumber}`,
        {
          method: "GET",
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      setPassengerData(data.data);
      setValue("names", data.data.names);
      setValue("surnames", data.data.surnames);
      setValue("identificationType", data.data.identificationType);
      setValue("identificationNumber", data.data.identificationNumber);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsSearching(false); // Volver a activar el botón de búsqueda al finalizar la búsqueda
    }
  };

  useEffect(() => {
    if (passengerData && !formSubmitted) {
      setValue("names", passengerData.names);
      setValue("surnames", passengerData.surnames);
      setValue("identificationType", passengerData.identificationType);
      setValue("identificationNumber", passengerData.identificationNumber);

      // Validar los datos del pasajero
      handleSubmit((data) => onSubmit(data))();

      // Desactivar los campos y el botón de búsqueda
      setFormSubmitted(true);
    }
  }, [passengerData, formSubmitted, setValue, handleSubmit, onSubmit]);

  const handleFormSubmit = (data: PassengerFormInputs) => {
    onSubmit(data);
    setFormSubmitted(true);
    onFormValidityChange(isValid, seatNumber);
  };

  const handleSearch = () => {
    setSearchError("");
    if (searchIdentificationNumber.trim() === "") {
      setSearchError("Por favor, introduce un número de documento.");
      return;
    }
    fetchData();
  };

  const handleReset = () => {
    reset();
    setFormSubmitted(false);
    setSearchIdentificationNumber("");
    setPassengerData(null);
    onFormValidityChange(false, seatNumber);
    setIsSearching(false);
  };

  return (
    <Section>
      <form autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <div className="mb-1 border p-2 rounded-sm col-span-2 flex justify-between items-center bg-travely-100/10">
            <h2 className="bg-travely-200 text-white border rounded-md p-2">
              Asiento: <span className="font-bold">{seatNumber}</span>
            </h2>
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Buscar por documento"
                value={searchIdentificationNumber}
                onChange={(e) => setSearchIdentificationNumber(e.target.value)}
                className="mr-2"
              />
              <Button
                onClick={handleSearch}
                variant={"confirm"}
                className="text-1xl"
                disabled={isSearching}
              >
                <FaSearch />
              </Button>
            </div>
          </div>

          <div className="mb-1">
            <Label>Nombres</Label>
            <Input
              autoComplete=""
              type="text"
              id="names"
              placeholder="Nombres"
              {...register("names")}
              className={`w-full ${formSubmitted ? "bg-green-100" : ""}`}
              disabled={formSubmitted || passengerData !== null}
            />
            {errors.names && (
              <span className="text-red-500 text-xs">
                {errors.names.message}
              </span>
            )}
          </div>
          <div className="mb-1">
            <Label>Apellidos</Label>
            <Input
              type="text"
              id="surnames"
              placeholder="Apellidos"
              {...register("surnames")}
              className={`w-full ${formSubmitted ? "bg-green-100" : ""}`}
              disabled={formSubmitted || passengerData !== null}
            />
            {errors.surnames && (
              <span className="text-red-500 text-xs">
                {errors.surnames.message}
              </span>
            )}
          </div>
          <div className="mb-1">
            <ComboBox
              id="identificationType"
              label="Tipo de documento"
              options={DocumentTypes}
              register={register("identificationType")}
              className={`w-full ${formSubmitted ? "bg-green-100" : ""}`}
              disabled={formSubmitted || passengerData !== null}
            />
            {errors.identificationType && (
              <span className="text-red-500 text-xs">
                {errors.identificationType.message}
              </span>
            )}
          </div>
          <div className="mb-1">
            <Label>Número de documento</Label>
            <Input
              type="text"
              id="identificationNumber"
              placeholder="Número de documento"
              {...register("identificationNumber")}
              className={`w-full ${formSubmitted ? "bg-green-100" : ""}`}
              disabled={formSubmitted || passengerData !== null}
            />
            {errors.identificationNumber && (
              <span className="text-red-500 text-xs">
                {errors.identificationNumber.message}
              </span>
            )}
          </div>
        </div>
        <div className="mt-2 flex justify-end">
          <Button
            variant={"secondary"}
            type="button"
            onClick={handleReset}
            disabled={!formSubmitted}
            className="mr-2"
          >
            Restablecer
          </Button>
          <Button variant={"other"} type="submit" disabled={formSubmitted}>
            Registrar Pasajero
          </Button>
        </div>
      </form>
    </Section>
  );
};

export default PassengerForm;
