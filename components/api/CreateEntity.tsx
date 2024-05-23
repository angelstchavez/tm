import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";

interface EntityAttributes {
  [key: string]: string | number | boolean | Date;
}

interface CreateEntityDialogProps {
  entityName: string;
  entityAttributes: EntityAttributes;
  onSuccess: () => void;
  onError: (error: string) => void;
}

export function CreateEntityDialog({
  entityName,
  entityAttributes,
  onSuccess,
  onError,
}: CreateEntityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleSubmit = async () => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entityName}/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify(entityAttributes),
        }
      );

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.data || `Error al crear ${entityName}.`);
      }

      onSuccess();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Error al crear ${entityName}.`;
      setError(errorMessage);
      setIsError(true);
      onError(errorMessage);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="travely">Crear</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deaa crear a {entityName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Descripción de lo que hace la entidad.
          </AlertDialogDescription>
          {isError && <p className="text-red-600 font-bold">{error}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button onClick={() => setIsOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>Guardar</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
