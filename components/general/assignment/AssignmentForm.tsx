"use client";

import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";

import ComboboxFetch from "@/components/api/ComboboxFetch";
import { CreateEntityDialog } from "@/components/api/CreateEntity";
import { Button } from "@/components/ui/button";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import { zodResolver } from "@hookform/resolvers/zod";

const FormSchema = z.object({
  carId: z.string().nonempty("Introduce una marca válida."),
  mainDriverId: z.string().nonempty("Introduce una marca válida."),
  auxiliaryDriverId: z.string().nonempty("Introduce una marca válida."),
});

const AssignmentForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      carId: "",
      mainDriverId: "",
      auxiliaryDriverId: "",
    },
  });

  const [formData, setFormData] = useState<z.infer<typeof FormSchema> | null>(
    null
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    setFormData(data);
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
      <CustomTitle title={"Registrar asignación"}></CustomTitle>
      <form
        className="flex flex-wrap justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full sm:w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="flex flex-col sm:flex-col md:flex-row md:space-x-4">
            <div className="w-full sm:w-full md:w-1/3">
              <ComboboxFetch
                id="carId"
                endpoint="car/get-all"
                label="Coche"
                register={register("carId")}
                error={errors.carId?.message}
                displayFormat={(item) =>
                  `${item.plate} - ${item.manufacturingYear} - ${item.color}`
                }
              />
            </div>
            <div className="w-full sm:w-full md:w-1/3">
              <ComboboxFetch
                id="mainDriverId"
                endpoint="employee/get-all-by-role/Conductor"
                label="Conductor principal"
                register={register("mainDriverId")}
                error={errors.mainDriverId?.message}
                displayFormat={(item) =>
                  `${item.person.names} - ${item.person.surnames} - ${item.person.identificationNumber}`
                }
              />
            </div>
            <div className="w-full sm:w-full md:w-1/3">
              <ComboboxFetch
                id="auxiliaryDriverId"
                endpoint="employee/get-all-by-role/Conductor"
                label="Conductor auxiliar"
                register={register("auxiliaryDriverId")}
                error={errors.auxiliaryDriverId?.message}
                displayFormat={(item) =>
                  `${item.person.names} - ${item.person.surnames} - ${item.person.identificationNumber}`
                }
              />
            </div>
          </div>
          <div>
            <CreateEntityDialog
              entity="car-driver"
              entityName={formData?.carId ?? ""}
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
      </form>
    </Section>
  );
};

export default AssignmentForm;
