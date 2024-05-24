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
});

const BrandForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid }, // Utiliza isValid del formState
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
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
    window.location.reload();
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
