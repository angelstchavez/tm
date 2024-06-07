import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import { CreateEntityDialog } from "@/components/api/CreateEntity";
import { Button } from "@/components/ui/button";

const FormSchema = z.object({
  name: z.string().nonempty("Introduce una marca válida."),
  createdAt: z.date(),
});

type FormData = z.infer<typeof FormSchema>;

const BrandForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      createdAt: new Date(),
    },
  });

  const [formData, setFormData] = useState<FormData | null>(null);

  const onSubmit = (data: FormData) => {
    const dataWithTimestamp = {
      ...data,
      createdAt: new Date(),
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
      <CustomTitle title={"Registrar marca"} />
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col lg:flex-row">
          <div>
            <Label htmlFor="name">Nombre de la marca</Label>
            <Input id="name" placeholder="Ej. Toyota" {...register("name")} />
            {errors.name && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>
        </div>
        <div className="mt-4">
          <CreateEntityDialog
            entity="car-brand"
            entityName={formData?.name ?? ""}
            entityAttributes={formData ?? {}}
            onComplete={handleOnComplete}
            onError={handleError}
            buttonComponent={
              <Button variant={"travely"} disabled={!isValid} type="submit">
                Crear
              </Button>
            }
          />
        </div>
      </form>
    </Section>
  );
};

export default BrandForm;
