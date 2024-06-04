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
  identificationType: z.string().nonempty("Selecciona un tipo de documento válido."),
  identificationNumber: z
    .string()
    .nonempty("Introduce un número de documento válido."),
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
      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <div className="mb-2 bg-travely-200 text-white p-2 rounded-sm">
          <h2>
            Pasajero del asiento:{" "}
            <span className="font-bold">{seatNumber}</span>
          </h2>
        </div>
        <div className="mb-2">
          <Label>Nombres</Label>
          <Input
            type="text"
            id="names"
            placeholder="Nombres"
            {...register("names")}
          />
          {errors.names && (
            <span className="text-red-500 text-sm">
              {errors.names.message}
            </span>
          )}
        </div>
        <div className="mb-2">
          <Label>Apellidos</Label>
          <Input
            type="text"
            id="surnames"
            placeholder="Apellidos"
            {...register("surnames")}
          />
          {errors.surnames && (
            <span className="text-red-500 text-sm">
              {errors.surnames.message}
            </span>
          )}
        </div>
        <div className="mb-2">
          <ComboBox
            id="identificationType"
            label="Tipo de documento"
            options={DocumentTypes}
            register={register("identificationType")}
          />
          {errors.identificationType && (
            <span className="text-red-500 text-sm">
              {errors.identificationType.message}
            </span>
          )}
        </div>
        <div className="mb-2">
          <Label>Número de documento</Label>
          <Input
            type="text"
            id="identificationNumber"
            placeholder="Número de documento"
            {...register("identificationNumber")}
          />
          {errors.identificationNumber && (
            <span className="text-red-500 text-sm">
              {errors.identificationNumber.message}
            </span>
          )}
        </div>
      </form>
    </Section>
  );
};

export default PassengerForm;
