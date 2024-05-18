"use client";

import React from "react";
import { useForm } from "react-hook-form";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/contexts/AuthContext";

const FormSchema = z.object({
  username: z.string().nonempty("Introduce un usuario válido."),
  password: z.string().min(6, "Debe contener 6 caracteres como mínimo."),
});

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login } = useAuthContext();
  const [errorDescription, setErrorDescription] = React.useState<string>("");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login/${data.username}/${data.password}`,
        {
          method: "GET",
          headers: {
            accept: "application/json",
          },
        }
      );

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.data || "Error al iniciar sesión.");
      }

      const tokens = responseData;
      login(tokens);
      router.push("/admin");
    } catch (error: any) {
      setErrorDescription(error.message || "Error al iniciar sesión.");
    }

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const handleResetPasswordClick = () => {
    router.push("/reset-password");
  };

  const clearErrorDescription = () => {
    setErrorDescription("");
  };

  return (
    <div className="bg-travely-400 w-full h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="font-bold text-travely-300">
            Travely Manager
          </CardTitle>
          <CardDescription>Bienvenido</CardDescription>
          <div className="relative w-full max-w-4xl mx-auto">
            <Image
              src={"/images/bus.png"}
              alt={"Autobús viajando"}
              layout="responsive"
              width={600}
              height={600}
              className="mx-auto"
            />
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-3"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="username">Nombre de usuario</Label>
              <Input
                type="text"
                id="username"
                placeholder="example"
                {...form.register("username")}
                onInput={clearErrorDescription}
              />
            </div>
            {form.formState.errors.username && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.username.message}
              </span>
            )}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                placeholder="••••••••••"
                {...form.register("password")}
                onInput={clearErrorDescription}
              />
            </div>
            {form.formState.errors.password && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.password.message}
              </span>
            )}
            {errorDescription && (
              <span className="text-red-600 text-sm font-semibold">
                {errorDescription}
              </span>
            )}
            <Button variant={"travely"} className="w-full mt-3" type="submit">
              Iniciar sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            variant={"link"}
            onClick={handleResetPasswordClick}
            className="w-full"
          >
            Restablecer contraseña
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
