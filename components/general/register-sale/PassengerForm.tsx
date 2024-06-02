import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DocumentTypes } from "../../../utilities/types";

// Definir el esquema de validación con Zod
const PassengerFormSchema = z.object({
  firstName: z.string().nonempty(),
  lastName: z.string().nonempty(),
  documentType: z.string().nonempty(),
  documentNumber: z.string().nonempty(),
});

interface PassengerFormProps {
  seatNumber: number;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ seatNumber }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data: any) => {
    try {
      // Valida los datos del formulario con Zod
      PassengerFormSchema.parse(data);

      // Si la validación es exitosa, envía los datos al backend
      console.log("Datos válidos:", data);
    } catch (error) {
      // Si la validación falla, maneja el error
      console.error("Error de validación:", error);
    }
  };

  return (
    <form className="border rounded-lg p-4" onSubmit={handleSubmit(onSubmit)}>
      <h2>Pasajero del asiento: {seatNumber}</h2>
      <div className="mb-2">
        <Label>Nombres</Label>
        <Input
          type="text"
          id="firstName"
          placeholder="Nombres"
          {...register("firstName")}
        />
      </div>
      <div className="mb-2">
        <Label>Apellidos</Label>
        <Input
          type="text"
          id="lastName"
          placeholder="Apellidos"
          {...register("lastName")}
        />
      </div>
      <div className="mb-2">
        <ComboBox
          id="documentType"
          label="Tipo de documento"
          options={DocumentTypes}
          register={register("documentType")}
        />
      </div>
      <div className="mb-2">
        <Label>Número de documento</Label>
        <Input
          type="text"
          id="documentNumber"
          placeholder="Número de documento"
          {...register("documentNumber")}
        />
      </div>
      <Button type="submit" variant={"other"}>
        Registrar pasajero
      </Button>
    </form>
  );
};

export default PassengerForm;
