"use client";

import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import { fetchData } from "@/utilities/FetchData";
import CustomTable from "@/components/utils/CustomTable";

interface Person {
  id: number;
  names: string;
  surnames: string;
  identificationNumber: string;
  identificationType: string;
  gender: string;
  birthdate: string;
  email: string;
  mobilePhone: string;
  createdAt: string;
}

interface Customer {
  id: number;
  person: Person;
  createdAt: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const CustomerTable: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [originalCustomers, setOriginalCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchName, setSearchName] = useState<string>("");
  const [searchDocument, setSearchDocument] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/customer/get-all`,
      setCustomers,
      setOriginalCustomers,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    let filteredCustomers = originalCustomers;

    if (searchName) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        `${customer.person.names} ${customer.person.surnames}`
          .toLowerCase()
          .includes(searchName.toLowerCase())
      );
    }

    if (searchDocument) {
      filteredCustomers = filteredCustomers.filter((customer) =>
        customer.person.identificationNumber.includes(searchDocument)
      );
    }

    setCustomers(filteredCustomers);
  }, [searchName, searchDocument, originalCustomers]);

  const handleCustomerDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleCustomerUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns = [
    {
      name: "Nombre Completo",
      selector: (row: Customer) => `${row.person.names} ${row.person.surnames}`,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Número de Identificación",
      selector: (row: Customer) => row.person.identificationNumber,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Tipo de Identificación",
      selector: (row: Customer) => row.person.identificationType,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Género",
      selector: (row: Customer) => row.person.gender,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Fecha de Nacimiento",
      selector: (row: Customer) => {
        const date = new Date(row.person.birthdate);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      },
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Email",
      selector: (row: Customer) => row.person.email,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Teléfono Móvil",
      selector: (row: Customer) => row.person.mobilePhone,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Fecha de Registro",
      selector: (row: Customer) => {
        const date = new Date(row.createdAt);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
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
      cell: (row: Customer) => (
        <div className="flex space-x-2">
          <button className="bg-orange-600 rounded text-white p-1">
            <FaEdit className="text-xl" />
          </button>
          <DeleteEntityDialog
            entityId={row.id}
            entity="customer"
            entityCamelCase="customer"
            entityName={`${row.person.names} ${row.person.surnames}`}
            onComplete={handleCustomerDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={customers}
      searchTerm={searchName}
      setSearchTerm={setSearchName}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleCustomerDelete}
      exportCsvData={customers.map((customer) => ({
        "Nombre Completo": `${customer.person.names} ${customer.person.surnames}`,
        "Número de Identificación": customer.person.identificationNumber,
        "Tipo de Identificación": customer.person.identificationType,
        Género: customer.person.gender,
        "Fecha de Nacimiento": new Date(
          customer.person.birthdate
        ).toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        Email: customer.person.email,
        "Teléfono Móvil": customer.person.mobilePhone,
        "Fecha de Registro": new Date(customer.createdAt).toLocaleDateString(
          "es-CO",
          {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }
        ),
      }))}
      exportCsvFileName="clientes.csv"
      generalReportEntity="customer"
      handleUpdate={handleCustomerUpdate}
    />
  );
};

export default CustomerTable;
