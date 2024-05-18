"use client";

import React from "react";
import { useForm } from "react-hook-form";
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

const FormSchema = z.object({
  email: z.string().email({
    message: "Introduce un correo electrónico válido.",
  }),
  password: z.string().min(6, {
    message: "Debe contener 6 caracteres como mínimo.",
  }),
});

const LoginPage: React.FC = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: z.infer<typeof FormSchema>) => {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  const router = useRouter();

  const handleResetPasswordClick = () => {
    router.push("/reset-password");
  };

  return (
    <div className="bg-travely-400 w-full h-screen flex justify-center items-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle className="font-bold text-travely-300">Travely Manager</CardTitle>
          <CardDescription>Bienvenido</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid w-full gap-3"
          >
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                type="email"
                id="email"
                placeholder="email@example.com"
                {...form.register("email")}
              />
            </div>
            {form.formState.errors.email && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.email.message}
              </span>
            )}
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                id="password"
                placeholder="Password"
                {...form.register("password")}
              />
            </div>
            {form.formState.errors.password && (
              <span className="text-red-600 text-sm font-semibold">
                {form.formState.errors.password.message}
              </span>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant={"travely"}
            className="w-full"
            type="submit"
            onClick={form.handleSubmit(onSubmit)}
          >
            Iniciar sesión
          </Button>
        </CardFooter>
        <Button
          variant={"link"}
          onClick={handleResetPasswordClick}
          className="w-full"
        >
          Restablecer contraseña
        </Button>
      </Card>
    </div>
  );
};

export default LoginPage;
