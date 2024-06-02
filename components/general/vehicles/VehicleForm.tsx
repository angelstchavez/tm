import ComboboxFetch from "@/components/api/ComboboxFetch";
import { CreateEntityDialog } from "@/components/api/CreateEntity";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import { Colors } from "@/utilities/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const currentYear = new Date().getFullYear();

const FormSchema = z.object({
  plate: z
    .string()
    .regex(
      /^[A-Za-z]{3}[0-9]{3}$/,
      "La placa debe tener 3 letras seguidas de 3 números."
    ),
  color: z.string().nonempty("Introduce un color válido."),
  manufacturingYear: z.preprocess(
    (val) => (val ? parseInt(val as string, 10) : NaN),
    z
      .number()
      .int("El año de fabricación debe ser un número entero.")
      .gt(1990, "El año de fabricación debe ser mayor a 1990.")
      .lte(
        currentYear + 2,
        `El año de fabricación no puede ser mayor a ${currentYear + 2}.`
      )
  ),
  carBrandId: z.string().nonempty("Introduce una marca válida."),
  carModelId: z.string().nonempty("Introduce un modelo válido."),
  createdAt: z.date(),
});

type FormData = z.infer<typeof FormSchema>;

const VehicleForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      plate: "",
      color: "",
      manufacturingYear: 0,
      carBrandId: "",
      carModelId: "",
      createdAt: new Date(),
    },
  });

  const [formData, setFormData] = useState<FormData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date(),
    };
    setFormData(dataWithTimestamp);
    setDialogOpen(true);
  };

  const handleOnComplete = () => {
    console.log("Entidad creada con éxito");
    setDialogOpen(false);
    setFormData(null);
  };

  const handleError = (error: string) => {
    console.error(error);
  };

  return (
    <Section>
      <CustomTitle title={"Registrar vehículo"}></CustomTitle>
      <form
        className="flex flex-wrap justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="mb-4">
            <Label htmlFor="plate">Placa</Label>
            <Input
              id="plate"
              placeholder="Ej. ABC123"
              type="text"
              {...register("plate")}
            ></Input>
            {errors.plate && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.plate.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <ComboBox
              id="color"
              label="Color"
              options={Colors}
              register={register("color")}
              error={errors.color?.message}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="manufacturingYear">Año de fabricación</Label>
            <Input
              id="manufacturingYear"
              placeholder="Ej. 2000"
              type="number"
              {...register("manufacturingYear", { valueAsNumber: true })}
            ></Input>
            {errors.manufacturingYear && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.manufacturingYear.message}
              </span>
            )}
          </div>
          <div>
            <CreateEntityDialog
              entity="car-model"
              entityName={formData?.plate ?? ""}
              entityAttributes={formData ?? {}}
              onComplete={handleOnComplete}
              onError={handleError}
              buttonComponent={
                <Button variant="travely" type="submit" disabled={!isValid}>
                  Crear
                </Button>
              }
            />
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="mb-4">
            <ComboboxFetch
              id="carBrandId"
              endpoint="car-brand/get-all"
              label="Marca"
              register={register("carBrandId")}
              error={errors.carBrandId?.message}
            />
          </div>
          <div className="mb-4">
            <ComboboxFetch
              id="carModelId"
              endpoint="car-model/get-all"
              label="Modelo"
              register={register("carModelId")}
              error={errors.carModelId?.message}
            />
          </div>
        </div>
      </form>
    </Section>
  );
};

export default VehicleForm;
