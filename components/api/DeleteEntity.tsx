import { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { MdDelete } from "react-icons/md";

interface DeleteEntityDialogProps {
  entityId: number;
  entityName: string;
  entity: string;
  entityCamelCase: string;
  onComplete: () => void;
}

export function DeleteEntityDialog({
  entityId,
  entityName,
  entity,
  entityCamelCase,
  onComplete,
}: DeleteEntityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);

  const handleDeleteConfirmation = async () => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/delete?${entityCamelCase}Id=${entityId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOpen(false);
        onComplete();
      } else {
        const responseData = await response.json();
        setIsError(true);
        setError(responseData.data || `Error al eliminar ${entityName}.`);
      }
    } catch (error) {
      setIsError(true);
      setError(`Error al eliminar ${entityName}.`);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setIsError(false);
    setError(null);
  };

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleClose();
        } else {
          setIsOpen(true);
        }
      }}
    >
      <AlertDialogTrigger asChild>
        <Button variant="destructive" onClick={() => setIsOpen(true)}>
          <MdDelete className="text-xl" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            ¿Estás seguro de eliminar {entityName}?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará permanentemente el
            registro de nuestros servidores.
          </AlertDialogDescription>
          {isError && <p className="text-red-600 font-bold">{error}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <Button
            variant={"destructive"}
            onClick={handleDeleteConfirmation}
            disabled={isError}
          >
            Continuar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
