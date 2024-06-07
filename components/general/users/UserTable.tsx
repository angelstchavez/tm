"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import ActionButtons from "@/components/utils/ActionButtons";
import { getToken } from "@/lib/GetToken";
import CustomTable from "@/components/utils/CustomTable";
import { fetchData } from "@/utilities/FetchData";

interface User {
  id: number;
  username: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const UserTable: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [originalUsers, setOriginalUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-all`,
      setUsers,
      setOriginalUsers,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setUsers(originalUsers);
    } else {
      const filteredUsers = originalUsers.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setUsers(filteredUsers);
    }
  }, [searchTerm, originalUsers]);

  const handleUserDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleUserUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<User>[] = [
    {
      name: "Nombre de usuario",
      selector: (row) => row.username,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Rol",
      selector: (row) => row.role,
      sortable: true,
      style: {
        fontSize: 14,
        width: "400px",
      },
    },
    {
      name: "Fecha de creación",
      sortable: true,
      selector: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      },
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ActionButtons
          row={row}
          onEdit={() => {}}
          onDelete={handleUserDelete}
          entity="user"
          entityCamelCase="user"
          entityName={row.username}
        />
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={users}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleUserDelete}
      handleUpdate={handleUserUpdate}
      exportCsvData={users.map((user) => ({
        "Nombre de usuario": user.username,
        Rol: user.role,
        "Fecha de creación": new Date(user.createdAt).toLocaleDateString(
          "es-CO",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      }))}
      exportCsvFileName="usuarios.csv"
      generalReportEntity="user"
    />
  );
};

export default UserTable;
