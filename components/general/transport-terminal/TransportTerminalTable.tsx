"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/utils/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";

interface TransportTerminal {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  department: Department;
  city: City;
}

interface City {
  id: number;
  name: string;
}

interface Department {
  id: number;
  name: string;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const TransportTerminalTable: React.FC = () => {
  const [terminals, setTerminals] = useState<TransportTerminal[]>([]);
  const [originalTerminals, setOriginalTerminals] = useState<
    TransportTerminal[]
  >([]);
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/transport-terminal/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las terminales de transporte.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedTerminals = responseData.data;
        setTerminals(fetchedTerminals);
        setOriginalTerminals(fetchedTerminals);
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
      setTerminals(originalTerminals);
    } else {
      const filteredTerminals = originalTerminals.filter((terminal) =>
        terminal.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setTerminals(filteredTerminals);
    }
  }, [searchTerm, originalTerminals]);

  const handleTerminalDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<TransportTerminal>[] = [
    {
      name: "Nombre",
      selector: (row) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Dirección",
      selector: (row) => row.address,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Teléfono",
      selector: (row) => row.phoneNumber,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Ciudad",
      selector: (row) => row.city.name,
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
            entity="transport-terminal"
            entityCamelCase="transportTerminal"
            entityName={row.name}
            onComplete={handleTerminalDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Terminales de transporte"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por nombre de terminal"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={terminals}
          pagination
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
      </div>
    </Section>
  );
};

export default TransportTerminalTable;
