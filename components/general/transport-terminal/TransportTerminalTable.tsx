import React, { useState, useEffect } from "react";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTable from "@/components/utils/CustomTable";
import { FaEdit } from "react-icons/fa";
import { fetchData } from "@/utilities/FetchData";

interface TransportTerminal {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  city: City;
}

interface City {
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
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/transport-terminal/get-all`,
      setTerminals,
      setOriginalTerminals,
      setError,
      setLoading
    );
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

  const handleTerminalUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns = [
    {
      name: "Nombre",
      selector: (row: TransportTerminal) => row.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "darkred",
      },
    },
    {
      name: "Dirección",
      selector: (row: TransportTerminal) => row.address,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Teléfono",
      selector: (row: TransportTerminal) => row.phoneNumber,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Ciudad",
      selector: (row: TransportTerminal) => row.city.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row: TransportTerminal) => (
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
    <CustomTable
      columns={columns}
      data={terminals}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      exportCsvData={terminals.map((terminal) => ({
        Nombre: terminal.name,
        Dirección: terminal.address,
        Teléfono: terminal.phoneNumber,
        Ciudad: terminal.city.name,
      }))}
      exportCsvFileName="terminales_de_transporte.csv"
      generalReportEntity="transport-terminal"
      handleDelete={handleTerminalDelete}
      handleUpdate={handleTerminalUpdate}
    />
  );
};

export default TransportTerminalTable;
