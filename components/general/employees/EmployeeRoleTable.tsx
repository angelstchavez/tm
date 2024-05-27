"use client";

import React, { useState, useEffect } from "react";
import DataTable, { TableColumn } from "react-data-table-component";
import Cookies from "js-cookie";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";
import Loading from "@/components/utils/Loading";

interface Employee {
  id: number;
  role: string;
  person: {
    id: number;
    names: string;
    surnames: string;
    identificationType: string;
    identificationNumber: string;
    gender: string;
    birthdate: string;
    email: string;
    mobilePhone: string;
    createdAt: string;
  };
  createdAt: string;
}

interface Props {
  role: string;
  title: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const EmployeeRoleTable: React.FC<Props> = ({ role, title }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [originalEmployees, setOriginalEmployees] = useState<Employee[]>([]);
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/get-all-by-role/${role}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los empleados.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedEmployees = responseData.data;
        setEmployees(fetchedEmployees);
        setOriginalEmployees(fetchedEmployees);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [reloadData, role]);

  useEffect(() => {
    if (searchTerm === "") {
      setEmployees(originalEmployees);
    } else {
      const filteredEmployees = originalEmployees.filter(
        (employee) =>
          employee.person.names
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.person.surnames
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setEmployees(filteredEmployees);
    }
  }, [searchTerm, originalEmployees]);

  const columns: TableColumn<Employee>[] = [
    {
      name: "Nombres",
      selector: (row) => row.person.names,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Apellidos",
      selector: (row) => row.person.surnames,
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
      },
    },
    {
      name: "Fecha de Registro",
      selector: (row) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      },
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex space-x-2">
          <button className="bg-orange-600 rounded text-white p-1">
            <FaEdit className="text-xl" />
          </button>
          <DeleteEntityDialog
            entityId={row.id}
            entity="employee"
            entityCamelCase="employee"
            entityName={`${row.person.names} ${row.person.surnames}`}
            onComplete={() => {}}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={title} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por nombres o apellidos"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={employees}
          pagination
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
      </div>
    </Section>
  );
};

export default EmployeeRoleTable;
