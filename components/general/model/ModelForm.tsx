import React, { useState } from "react";
import { z } from "zod";

import { CreateEntityDialog } from "@/components/api/CreateEntity";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import { FuelTypes, ModelTypes, TransmissionTypes } from "@/utilities/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ComboboxFetch from "@/components/api/ComboboxFetch";

const FormSchema = z.object({
  name: z.string().nonempty("Introduce un modelo válido."),
  category: z.string().nonempty("Introduce una categoría válida."),
  fueltype: z.string().nonempty("Introduce un tipo de combustible válido."),
  transmissionType: z
    .string()
    .nonempty("Introduce un tipo de transmisión válido."),
  seatingCapacity: z.preprocess(
    (val) => parseInt(z.string().parse(val), 10),
    z
      .number({
        invalid_type_error:
          "La capacidad de asientos debe ser un número válido.",
      })
      .min(10, "La capacidad de asientos debe ser al menos 10.")
  ),
  carBrandId: z.string().nonempty("Introduce una marca válida."),
  createdAt: z.date(),
});

type FormData = z.infer<typeof FormSchema>;

const ModelForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      category: "",
      fueltype: "",
      transmissionType: "",
      seatingCapacity: NaN,
      carBrandId: "",
      createdAt: new Date(),
    },
  });

  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date(), // Aseguramos que createdAt tenga la fecha actual
    };
    setFormData(dataWithTimestamp);
  };

  const handleOnComplete = () => {
    console.log("Entidad creada con éxito");
    setFormData(null);
  };

  const handleError = (error: string) => {
    console.error(error);
  };

  return (
    <Section>
      <CustomTitle title={"Registrar modelo"}></CustomTitle>
      <form
        className="flex flex-wrap justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="mb-4">
            <Label htmlFor="name">Nombre del modelo</Label>
            <Input
              id="name"
              placeholder="Ej. Paradisso"
              type="text"
              {...register("name")}
            ></Input>
            {errors.name && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <ComboBox
              id="category"
              label="Categoría"
              options={ModelTypes}
              register={register("category")}
              error={errors.category?.message}
            />
          </div>
          <div className="mb-4">
            <ComboBox
              id="fueltype"
              label="Tipo de gasolina"
              options={FuelTypes}
              register={register("fueltype")}
              error={errors.fueltype?.message}
            />
          </div>
          <div className="">
            <CreateEntityDialog
              entity="car-model"
              entityName={formData?.name ?? ""}
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
            <ComboBox
              id="transmissionType"
              label="Tipo de transmisión"
              options={TransmissionTypes}
              register={register("transmissionType")}
              error={errors.transmissionType?.message}
            />
          </div>
          <div className="mb-4">
            <Label htmlFor="seatingCapacity">Capacidad de asientos</Label>
            <Input
              id="seatingCapacity"
              placeholder="min. 10"
              type="number"
              {...register("seatingCapacity")}
            ></Input>
            {errors.seatingCapacity && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.seatingCapacity.message}
              </span>
            )}
          </div>
          <div>
            <ComboboxFetch
              id="carBrandId"
              endpoint="car-brand/get-all"
              label="Marca"
              register={register("carBrandId")}
              error={errors.carBrandId?.message}
            />
          </div>
        </div>
      </form>
    </Section>
  );
};

export default ModelForm;
