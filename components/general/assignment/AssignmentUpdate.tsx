import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import CustomTitle from "@/components/utils/CustomTitle";
import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";
import ComboboxFetch from "@/components/api/ComboboxFetch";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

// Esquema de validación con zod
const FormSchema = z.object({
  carId: z.string().nonempty("Introduce un coche válido."),
  mainDriverId: z.string().nonempty("Introduce un conductor principal válido."),
  auxiliaryDriverId: z
    .string()
    .nonempty("Introduce un conductor auxiliar válido."),
  isActive: z.boolean(),
});

interface FormValues {
  carId: string;
  mainDriverId: string;
  auxiliaryDriverId: string;
  isActive: boolean;
}

interface CarData {
  carId: string;
  mainDriverId: string;
  auxiliaryDriverId: string;
  isActive: boolean;
}

const initialState: FormValues = {
  carId: "",
  mainDriverId: "",
  auxiliaryDriverId: "",
  isActive: true,
};

const AssignmentUpdate: React.FC<{
  id: number;
  entity: string;
  entityName: string;
  onComplete: () => void;
}> = ({ id, entity, entityName, onComplete }) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
    watch, // Agregar watch para obtener el valor actual del campo
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: initialState,
  });

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/car/get-by-id/${id}`,
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
          throw new Error("Error al obtener los datos del auto.");
        }

        const data: CarData = await response.json();

        // Llenar los campos del formulario con los datos recibidos
        setValue("carId", data.carId);
        setValue("mainDriverId", data.mainDriverId);
        setValue("auxiliaryDriverId", data.auxiliaryDriverId);
        setValue("isActive", data.isActive);
      } catch (error) {
        // Manejar el error
        setIsError(true);
        setError("Error al obtener los datos del auto.");
      }
    };

    fetchData();
  }, [id, setValue]);

  const handleUpdate = async (data: FormValues) => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const requestData = {
        id,
        ...data,
        createdAt: new Date().toISOString(),
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(requestData),
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
    }
  };

  const handleClose = () => {
    setIsError(false);
    setError(null);
    setIsOpen(false);
    reset(initialState);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"update"} className="w-9 h-9" size={"icon"}>
          <MdModeEdit className="text-xl" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <CustomTitle title={`Actualizar asignación ${entityName}`} />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se actualizará el registro en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className="flex flex-col">
            <div className="w-full">
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
            <div className="w-full">
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
            <div className="w-full">
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
            <div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={watch("isActive")}
                  onCheckedChange={(value) => setValue("isActive", value)}
                />
                <Label htmlFor="isActive">Estado</Label>
              </div>
            </div>
          </div>
          {isError && error && (
            <ul className="text-red-600 text-sm">
              {error.split(",").map((errorMessage) => (
                <li key={errorMessage}>{errorMessage}</li>
              ))}
            </ul>
          )}
          <div className="flex justify-end">
            <DialogFooter className="flex-shrink-0">
              <AlertDialogCancel onClick={handleClose}>
                Cancelar
              </AlertDialogCancel>
            </DialogFooter>
            <div className="ml-4">
              <Button variant={"update"} type="submit" disabled={isSubmitting}>
                Actualizar
              </Button>
            </div>
          </div>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AssignmentUpdate;
