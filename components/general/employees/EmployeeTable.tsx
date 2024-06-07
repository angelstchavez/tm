"use client";

import React, { useState, useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import EmployeeUpdate from "./EmployeeUpdate";
import { fetchData } from "@/utilities/FetchData";
import CustomTable from "@/components/utils/CustomTable";

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

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const EmployeeTable: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [originalEmployees, setOriginalEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/employee/get-all`,
      setEmployees,
      setOriginalEmployees,
      setError,
      setLoading
    );
  }, [reloadData]);

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

  const handleEmployeeDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleEmployeeUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };
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
          <EmployeeUpdate
            id={row.id}
            entityName={`${row.person.names} ${row.person.surnames}`}
            onComplete={handleEmployeeUpdate}
          ></EmployeeUpdate>
          <DeleteEntityDialog
            entityId={row.id}
            entity="employee"
            entityCamelCase="employee"
            entityName={`${row.person.names} ${row.person.surnames}`}
            onComplete={handleEmployeeDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={employees}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleEmployeeDelete}
      handleUpdate={handleEmployeeUpdate}
      exportCsvData={employees.map((employee) => ({
        Nombres: employee.person.names,
        Apellidos: employee.person.surnames,
        Rol: employee.role,
        "Fecha de Registro": new Date(employee.createdAt).toLocaleDateString(
          "es-CO",
          {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }
        ),
      }))}
      exportCsvFileName="empleados.csv"
      generalReportEntity="employee"
    />
  );
};

export default EmployeeTable;
