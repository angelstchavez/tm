"use client";

import React from "react";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Cookies from "js-cookie";

const FormSchema = z
  .object({
    username: z.string().nonempty("Introduce un usuario válido."),
    password: z
      .string()
      .min(6, "Debe contener 6 caracteres como mínimo.")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula.")
      .regex(/[0-9]/, "Debe contener al menos un número."),
    confirmPassword: z
      .string()
      .min(6, "Debe contener 6 caracteres como mínimo."),
    role: z.string().nonempty("Seleccione un rol."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden.",
    path: ["confirmPassword"],
  });

const UserForm: React.FC = () => {
  const { login } = useAuthContext();
  const { toast } = useToast();
  const [errorDescription, setErrorDescription] = React.useState<string>("");
  const [successMessage, setSuccessMessage] = React.useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    const formData = {
      ...data,
      createdAt: new Date().toISOString().split("T")[0],
      isActive: true,
    };

    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData.data.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.data || "Error al registrar el usuario.");
      }

      setSuccessMessage("El usuario se registró satisfactoriamente.");
      toast({
        description: "Usuario creado exitosamente.",
      });
    } catch (error: any) {
      setErrorDescription(error.message || "Error al registrar el usuario.");
    }
  };

  const clearErrorDescription = () => {
    setErrorDescription("");
  };

  return (
    <>
      <h2 className="text-xl font-bold text-gray-800">Registrar usuario</h2>
      <div>
        <form
          className="grid w-full gap-3 sm:grid-cols-2"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="username">Nombre de usuario</Label>
            <Input
              type="text"
              id="username"
              placeholder="example"
              {...form.register("username")}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.username && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.username?.message}
              </span>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              type="password"
              id="password"
              placeholder="••••••••••"
              {...form.register("password")}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.password && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.password?.message}
              </span>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
            <Input
              type="password"
              id="confirmPassword"
              placeholder="••••••••••"
              {...form.register("confirmPassword")}
              onInput={clearErrorDescription}
            />
            {form.formState.errors.confirmPassword && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.confirmPassword?.message}
              </span>
            )}
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="role">Rol</Label>
            <select
              id="role"
              {...form.register("role")}
              className={`w-full pl-3 pr-10 mt-1 border focus:outline-none sm:text-sm rounded-md h-10 ${
                form.formState.errors.role ? "border-red-500" : "border"
              }`}
              onInput={clearErrorDescription}
            >
              <option value="">Seleccione</option>
              <option value="Administrador">Administrador</option>
              <option value="Conductor">Conductor</option>
              <option value="Vendedor">Vendedor</option>
            </select>
            {form.formState.errors.role && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.role?.message}
              </span>
            )}
          </div>
          {errorDescription && (
            <span className="col-span-2 text-red-600 text-sm font-semibold">
              {errorDescription}
            </span>
          )}
          <Button variant={"travely"} type="submit" className="">
            Registrar
          </Button>
        </form>
      </div>
    </>
  );
};

export default UserForm;
