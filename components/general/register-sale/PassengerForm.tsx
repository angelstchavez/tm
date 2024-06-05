import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import ComboBox from "@/components/ui/combobox";
import { DocumentTypes } from "@/utilities/types";
import { Button } from "@/components/ui/button";

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
}

const PassengerForm: React.FC<PassengerFormProps> = ({
  seatNumber,
  onSubmit,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PassengerFormInputs>({
    resolver: zodResolver(PassengerFormSchema),
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleFormSubmit = (data: PassengerFormInputs) => {
    onSubmit(data);
    setFormSubmitted(true); // Marcar el formulario como enviado
  };

  const handleReset = () => {
    reset();
    setFormSubmitted(false); // Restablecer el estado del formulario
  };

  return (
    <Section>
      <form autoComplete="off" onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
              className={`w-full ${formSubmitted ? "bg-green-100" : ""}`}
              disabled={formSubmitted}
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
              disabled={formSubmitted}
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
              disabled={formSubmitted}
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
              disabled={formSubmitted}
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
