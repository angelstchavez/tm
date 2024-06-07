import { Button } from "@/components/ui/button";
import ComboBox from "@/components/ui/combobox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomTitle from "@/components/utils/CustomTitle";
import { DocumentTypes, EmployeeRoles, Genders } from "@/utilities/types";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { MdModeEdit } from "react-icons/md";
import { DialogFooter } from "@/components/ui/dialog";

const FormSchema = z.object({
  person: z.object({
    names: z.string().nonempty("Introduce un nombre válido."),
    surnames: z.string().nonempty("Introduce un apellido válido."),
    identificationType: z
      .string()
      .nonempty("Selecciona un tipo de identificación válido."),
    identificationNumber: z
      .string()
      .min(6, "El número de identificación debe tener al menos 6 caracteres.")
      .nonempty("Introduce un número de identificación válido."),
    gender: z.string().nonempty("Selecciona un género válido."),
    birthdate: z
      .string()
      .nonempty("Introduce una fecha de nacimiento válida.")
      .refine((value) => {
        const birthdate = new Date(value);
        const today = new Date();
        const ageDifference = today.getFullYear() - birthdate.getFullYear();
        const isBeforeBirthday =
          today.getMonth() < birthdate.getMonth() ||
          (today.getMonth() === birthdate.getMonth() &&
            today.getDate() < birthdate.getDate());
        const age = isBeforeBirthday ? ageDifference - 1 : ageDifference;
        return age >= 18 && birthdate <= today;
      }, "La fecha de nacimiento debe ser válida y tener al menos 18 años."),
    email: z
      .string()
      .email("Introduce un correo electrónico válido.")
      .nonempty("Introduce un correo electrónico."),
    mobilePhone: z
      .string()
      .min(10, "El número de contacto debe tener 10 dígitos.")
      .max(10, "El número de contacto debe tener 10 dígitos.")
      .nonempty("Introduce un número de contacto válido."),
    createdAt: z.string().optional(),
  }),
  role: z.string().nonempty("Selecciona un rol válido."),
  createdAt: z.string().optional(),
});

const initialState = {
  person: {
    names: "",
    surnames: "",
    identificationType: "",
    identificationNumber: "",
    gender: "",
    birthdate: "",
    email: "",
    mobilePhone: "",
    createdAt: "",
  },
  role: "",
  createdAt: "",
};

const EmployeeUpdate: React.FC<{
  id: number;
  entityName: string;
  onComplete: () => void;
}> = ({ id, entityName, onComplete }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: "onChange",
    defaultValues: initialState,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData = JSON.parse(cookieValue);
        const token = cookieData?.data?.token;

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/get-by-id/${id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos del empleado.");
        }

        const data = await response.json();

        setValue("person.names", data.person.names);
        setValue("person.surnames", data.person.surnames);
        setValue("person.identificationType", data.person.identificationType);
        setValue(
          "person.identificationNumber",
          data.person.identificationNumber
        );
        setValue("person.gender", data.person.gender);
        setValue("person.birthdate", data.person.birthdate);
        setValue("person.email", data.person.email);
        setValue("person.mobilePhone", data.person.mobilePhone);
        setValue("role", data.role);
      } catch (error) {
        setIsError(true);
        setError("Error al obtener los datos del empleado.");
      }
    };

    fetchData();
  }, [id, setValue]);

  const handleUpdate = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({ id, ...data }),
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(
          responseData.data || `Error al actualizar ${entityName}.`
        );
      }

      onComplete();
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Error al actualizar ${entityName}.`;
      setError(errorMessage);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsError(false);
    setError(null);
    setIsOpen(false);
    reset(initialState);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"update"} className="w-9 h-9" size={"icon"}>
          <MdModeEdit className="text-xl" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <CustomTitle title={`Actualizar empleado ${entityName}`} />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se actualizará el registro en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <Label htmlFor="names">Nombres</Label>
              <Input
                id="names"
                placeholder="Ej. Juan"
                type="text"
                {...register("person.names")}
                className="w-full"
              />
              {errors.person?.names && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.names.message}
                </span>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              <Label htmlFor="surnames">Apellidos</Label>
              <Input
                id="surnames"
                placeholder="Ej. Pineda"
                type="text"
                {...register("person.surnames")}
                className="w-full"
              />
              {errors.person?.surnames && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.surnames.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <ComboBox
                id="identificationType"
                label="Tipo de identificación"
                options={DocumentTypes}
                register={register("person.identificationType")}
                error={errors.person?.identificationType?.message}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <Label htmlFor="identificationNumber">
                Número de identificación
              </Label>
              <Input
                id="identificationNumber"
                placeholder="Ej. 123456789"
                type="text"
                {...register("person.identificationNumber")}
                className="w-full"
              />
              {errors.person?.identificationNumber && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.identificationNumber.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <ComboBox
                id="gender"
                label="Género"
                options={Genders}
                register={register("person.gender")}
                error={errors.person?.gender?.message}
              />
            </div>
            <div className="w-full lg:w-1/2">
              <Label htmlFor="birthdate">Fecha de nacimiento</Label>
              <Input
                id="birthdate"
                type="date"
                {...register("person.birthdate")}
                className="w-full"
              />
              {errors.person?.birthdate && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.birthdate.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ej. example@example.com"
                {...register("person.email")}
                className="w-full"
              />
              {errors.person?.email && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.email.message}
                </span>
              )}
            </div>
            <div className="w-full lg:w-1/2">
              <Label htmlFor="mobilePhone">Número de contacto</Label>
              <Input
                id="mobilePhone"
                type="number"
                maxLength={10}
                minLength={10}
                placeholder="Ej. 3003032011"
                {...register("person.mobilePhone")}
                className="w-full"
              />
              {errors.person?.mobilePhone && (
                <span className="text-red-600 text-sm font-semibold">
                  {errors.person.mobilePhone.message}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/2">
              <ComboBox
                id="role"
                label="Rol"
                options={EmployeeRoles}
                register={register("role")}
                error={errors.role?.message}
              />
            </div>
          </div>
          {isError && error && (
            <div className="text-red-600">
              {error.split(",").map((errorMessage, index) => (
                <div key={index}>- {errorMessage}</div>
              ))}
            </div>
          )}
          <div className="flex justify-end mt-4">
            <DialogFooter className="flex-shrink-0">
              <AlertDialogCancel onClick={handleClose}>
                Cancelar
              </AlertDialogCancel>
            </DialogFooter>
            <div className="ml-4">
              <Button
                variant="travely"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Actualizar
              </Button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default EmployeeUpdate;
