import React from "react";
import { FaEdit } from "react-icons/fa";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";

interface ActionButtonsProps<T> {
  row: T;
  onEdit: (row: T) => void;
  onDelete: () => void;
  entity: string;
  entityCamelCase: string;
  entityName: string;
}

const ActionButtons = <T extends { id: number }>({
  row,
  onEdit,
  onDelete,
  entity,
  entityCamelCase,
  entityName,
}: ActionButtonsProps<T>): JSX.Element => (
  <div className="flex space-x-2">
    <button
      className="bg-orange-600 rounded text-white p-1"
      onClick={() => onEdit(row)}
    >
      <FaEdit className="text-xl" />
    </button>
    <DeleteEntityDialog
      entityId={row.id}
      entity={entity}
      entityCamelCase={entityCamelCase}
      entityName={entityName}
      onComplete={onDelete}
    />
  </div>
);

export default ActionButtons;
