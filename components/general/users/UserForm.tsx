"use client";

import { CreateEntityDialog } from "@/components/api/CreateEntity";
import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import { SystemRoles } from "@/utilities/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const FormSchema = z
  .object({
    createdAt: z.date(),
    username: z.string().nonempty("Introduce un usuario válido."),
    password: z
      .string()
      .min(6, "Debe contener 6 caracteres como mínimo.")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
      .regex(/\d/, "Debe contener al menos un número."),
    confirmPassword: z
      .string()
      .min(6, "Debe contener 6 caracteres como mínimo."),
    role: z.string().nonempty("Seleccione un rol."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof FormSchema>;

const UserForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
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
      <CustomTitle title={"Registrar usuario"} />
      <form
        className="flex flex-wrap justify-between"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="mb-4">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              id="username"
              placeholder="Ej. user123"
              type="text"
              {...register("username")}
            />
            {errors.username && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.username.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              placeholder="••••••••••"
              type="password"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.password.message}
              </span>
            )}
          </div>
          <div className="mb-4">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••••"
              type="password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/2 px-2">
          <div className="mb-4">
            <ComboBox
              id="role"
              label="Rol del usuario"
              options={SystemRoles}
              register={register("role")}
              error={errors.role?.message}
            />
          </div>
          <div className="">
            <CreateEntityDialog
              entity="auth"
              entityName={formData?.username ?? ""}
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

export default UserForm;
