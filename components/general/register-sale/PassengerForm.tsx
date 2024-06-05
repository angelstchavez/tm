import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { DocumentTypes } from "../../../utilities/types";
import Section from "@/components/ui/Section";

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

interface FormData {
  names: string;
  surnames: string;
  identificationType: string;
  identificationNumber: string;
}

interface PassengerFormProps {
  seatNumber: number;
  onFormValidChange: (seatNumber: number, isValid: boolean) => void;
  onSubmit: (data: FormData, seatNumber: number) => void;
  onFormDataChange: (seatNumber: number, data: FormData) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  seatNumber,
  onFormValidChange,
  onSubmit,
  onFormDataChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(PassengerFormSchema),
    mode: "onChange",
  });

  const formData = watch();

  useEffect(() => {
    onFormValidChange(seatNumber, isValid);
  }, [isValid, seatNumber, onFormValidChange]);

  useEffect(() => {
    onFormDataChange(seatNumber, formData);
  }, [formData, seatNumber, onFormDataChange]);

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data, seatNumber);
  };

  return (
    <Section>
      <form
        autoComplete="off"
        onSubmit={handleSubmit(handleFormSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-2"
      >
        <div className="mb-1 bg-travely-200 text-white p-2 rounded-sm col-span-2">
          <h2>
            Pasajero del asiento:{" "}
            <span className="font-bold">{seatNumber}</span>
          </h2>
        </div>
        <div className="mb-1">
          <Label>Nombres</Label>
          <Input
            autoComplete=""
            type="text"
            id="names"
            placeholder="Nombres"
            {...register("names")}
            className="w-full"
          />
          {errors.names && (
            <span className="text-red-500 text-xs">{errors.names.message}</span>
          )}
        </div>
        <div className="mb-1">
          <Label>Apellidos</Label>
          <Input
            type="text"
            id="surnames"
            placeholder="Apellidos"
            {...register("surnames")}
            className="w-full"
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
            className="w-full"
          />
          {errors.identificationNumber && (
            <span className="text-red-500 text-xs">
              {errors.identificationNumber.message}
            </span>
          )}
        </div>
      </form>
    </Section>
  );
};

export default PassengerForm;
