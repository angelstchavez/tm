import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DocumentTypes } from "../../../utilities/types";

const PassengerFormSchema = z.object({
  firstName: z.string().nonempty("Introduce un nombre válido."),
  lastName: z.string().nonempty("Introduce un apellido válido."),
  documentType: z.string().nonempty("Selecciona un tipo de documento válido."),
  documentNumber: z
    .string()
    .nonempty("Introduce un número de documento válido."),
});

interface FormData {
  firstName: string;
  lastName: string;
  documentType: string;
  documentNumber: string;
}

interface PassengerFormProps {
  seatNumber: number;
  onFormValidChange: (seatNumber: number, isValid: boolean) => void;
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  seatNumber,
  onFormValidChange,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(PassengerFormSchema),
    mode: "onChange",
  });

  useEffect(() => {
    onFormValidChange(seatNumber, isValid);
  }, [isValid, seatNumber, onFormValidChange]);

  const onSubmit = (data: FormData) => {
    console.log("Datos del pasajero:", data);
  };

  return (
    <form className="border rounded-lg p-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-2 bg-travely-200 text-white p-2 rounded-lg">
        <h2>
          Pasajero del asiento: <span className="font-bold">{seatNumber}</span>
        </h2>
      </div>
      <div className="mb-2">
        <Label>Nombres</Label>
        <Input
          type="text"
          id="firstName"
          placeholder="Nombres"
          {...register("firstName")}
        />
        {errors.firstName && (
          <span className="text-red-500 text-sm">
            {errors.firstName.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <Label>Apellidos</Label>
        <Input
          type="text"
          id="lastName"
          placeholder="Apellidos"
          {...register("lastName")}
        />
        {errors.lastName && (
          <span className="text-red-500 text-sm">
            {errors.lastName.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <ComboBox
          id="documentType"
          label="Tipo de documento"
          options={DocumentTypes}
          register={register("documentType")}
        />
        {errors.documentType && (
          <span className="text-red-500 text-sm">
            {errors.documentType.message}
          </span>
        )}
      </div>
      <div className="mb-2">
        <Label>Número de documento</Label>
        <Input
          type="text"
          id="documentNumber"
          placeholder="Número de documento"
          {...register("documentNumber")}
        />
        {errors.documentNumber && (
          <span className="text-red-500 text-sm">
            {errors.documentNumber.message}
          </span>
        )}
      </div>
    </form>
  );
};

export default PassengerForm;
