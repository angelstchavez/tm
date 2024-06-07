import { ReactElement, useState } from "react";
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

interface EntityAttributes {
  [key: string]: any;
}

interface CreateEntityDialogProps {
  readonly entity: string;
  readonly entityName: string;
  readonly entityAttributes: EntityAttributes;
  readonly onComplete: () => void;
  readonly onError: (error: string) => void;
  readonly buttonComponent: ReactElement;
}

export function CreateEntityDialog({
  entity,
  entityName,
  entityAttributes,
  onComplete,
  onError,
  buttonComponent,
}: CreateEntityDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;
      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/create`,
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
      onComplete();
      window.location.reload();
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Error al crear ${entityName}.`;
      setError(errorMessage);
      setIsError(true);
      onError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsError(false);
    setError(null);
    setIsOpen(false);
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
      <AlertDialogTrigger asChild>{buttonComponent}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>¿Desea crear {entityName}?</AlertDialogTitle>
          <AlertDialogDescription>
            Se creará un nuevo registro en el sistema.
          </AlertDialogDescription>
          {isError && <p className="text-red-600 font-bold">{error}</p>}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleClose}>Cancelar</AlertDialogCancel>
          <Button
            onClick={handleSubmit}
            variant={"confirm"}
            disabled={isError || isSubmitting}
          >
            Guardar
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
