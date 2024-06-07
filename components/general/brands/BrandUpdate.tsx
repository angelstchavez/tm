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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import CustomTitle from "@/components/utils/CustomTitle";
import React, { useEffect, useState } from "react";
import { MdModeEdit } from "react-icons/md";
import Cookies from "js-cookie";
import { useForm } from "react-hook-form";
import { DialogFooter } from "@/components/ui/dialog";

interface BrandUpdateProps {
  id: number;
  entity: string;
  entityName: string;
  onComplete: () => void;
}

interface FormValues {
  name: string;
}

const initialState: FormValues = {
  name: "",
};

const BrandUpdate: React.FC<BrandUpdateProps> = ({
  id,
  entity,
  entityName,
  onComplete,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>();

  const [isOpen, setIsOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState(initialState.name);

  useEffect(() => {
    const fetchEntityData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData = JSON.parse(cookieValue);
        const token = cookieData?.data?.token;
        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/get-by-id/${id}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (!response.ok) {
          throw new Error(
            data.message || `Error al obtener los datos de ${entityName}.`
          );
        }
        setName(data.name);
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Error al obtener los datos de ${entityName}.`;
        setError(errorMessage);
        setIsError(true);
      }
    };
    fetchEntityData();
  }, [id, entity, entityName]);

  const handleUpdate = async (data: FormValues) => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;
      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/update`,
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
    }
  };

  const handleClose = () => {
    setIsError(false);
    setError(null);
    setIsOpen(false);
    reset(initialState); // Reset the form to initial state
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
            <CustomTitle title={`Actualizar marca ${entityName}`} />
          </AlertDialogTitle>
          <AlertDialogDescription>
            Se actualizará el registro en el sistema.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form
          onSubmit={handleSubmit(handleUpdate)}
          className="flex flex-col lg:flex-row"
        >
          <div className="lg:flex-grow">
            <Label htmlFor="name">Nombre de la marca</Label>
            <Input
              id="name"
              placeholder="Ej. Toyota"
              defaultValue={name}
              {...register("name", {
                required: "Introduce un nombre válido.",
              })}
            />
            {errors.name && (
              <span className="text-red-600 text-sm font-semibold">
                {errors.name.message}
              </span>
            )}
          </div>
        </form>
        {isError && error && (
          <div className="text-red-600 ml-4 lg:ml-0">{error}</div>
        )}
        <div className="flex justify-end mt- lg:mt-0">
          <DialogFooter className="flex-shrink-0">
            <AlertDialogCancel onClick={handleClose}>
              Cancelar
            </AlertDialogCancel>
          </DialogFooter>
          <div className="ml-4">
            <Button variant={"update"} onClick={handleSubmit(handleUpdate)}>
              Actualizar
            </Button>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BrandUpdate;
