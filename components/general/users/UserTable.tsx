"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import GeneralReport from "@/components/utils/GeneralReport";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import ActionButtons from "@/components/utils/ActionButtons";

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
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData: { data: { token?: string } } =
          JSON.parse(cookieValue);
        const token = cookieData.data.token;

        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los usuarios.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedUsers = responseData.data;
        setUsers(fetchedUsers);
        setOriginalUsers(fetchedUsers);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
    <Section>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Usuarios</h2>
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={users}
          pagination
          highlightOnHover
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={users.map((user) => ({
                "Nombre de usuario": user.username,
                Rol: user.role,
                "Fecha de creación": new Date(
                  user.createdAt
                ).toLocaleDateString("es-CO", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }),
              }))}
              fileName="usuarios.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"user"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default UserTable;
