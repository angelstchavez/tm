import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type AlertDialogType = "confirm" | "update" | "delete";

interface CustomAlertDialogProps {
  triggerButton: React.ReactNode;
  type: AlertDialogType;
  title: string;
  description: string;
  onConfirm: () => void;
  isValid: boolean;
}

const CustomAlertDialog: React.FC<CustomAlertDialogProps> = ({
  triggerButton,
  type,
  title,
  description,
  onConfirm,
  isValid,
}) => {
  const [open, setOpen] = useState(false);

  let actionButtonClass = "";
  switch (type) {
    case "confirm":
      actionButtonClass = "bg-green-700 hover:bg-green-600";
      break;
    case "update":
      actionButtonClass = "bg-orange-600 hover:bg-orange-500";
      break;
    case "delete":
      actionButtonClass = "bg-red-600 hover:bg-red-500";
      break;
  }

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{triggerButton}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            className={actionButtonClass}
            onClick={handleConfirm}
            disabled={!isValid}
          >
            Confirmar
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CustomAlertDialog;
