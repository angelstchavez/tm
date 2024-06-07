"use client";

import React, { useState, useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import ActionButtons from "@/components/utils/ActionButtons";
import { fetchData } from "@/utilities/FetchData";
import CustomTable from "@/components/utils/CustomTable";

interface Vehicle {
  id: number;
  plate: string;
  color: string;
  manufacturingYear: number;
  carModel: {
    id: number;
    name: string;
    carBrand: {
      id: number;
      name: string;
    };
  };
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const VehicleTable: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [originalVehicles, setOriginalVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/car/get-all`,
      setVehicles,
      setOriginalVehicles,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setVehicles(originalVehicles);
    } else {
      const filteredVehicles = originalVehicles.filter((vehicle) =>
        vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setVehicles(filteredVehicles);
    }
  }, [searchTerm, originalVehicles]);

  const handleVehicleDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleVehicleUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<Vehicle>[] = [
    {
      name: "Placa",
      selector: (row) => row.plate,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Color",
      selector: (row) => row.color,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Año de fabricación",
      selector: (row) => row.manufacturingYear.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Modelo de auto",
      selector: (row) => row.carModel.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Marca de auto",
      selector: (row) => row.carModel.carBrand.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ActionButtons
          row={row}
          onEdit={handleVehicleUpdate}
          onDelete={handleVehicleDelete}
          entity="vehicle"
          entityCamelCase="vehicle"
          entityName={row.plate}
        />
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={vehicles}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleVehicleDelete}
      handleUpdate={handleVehicleUpdate}
      exportCsvData={vehicles.map((vehicle) => ({
        Placa: vehicle.plate,
        Color: vehicle.color,
        "Año de fabricación": vehicle.manufacturingYear,
        "Modelo de auto": vehicle.carModel.name,
        "Marca de auto": vehicle.carModel.carBrand.name,
      }))}
      exportCsvFileName="vehiculos.csv"
      generalReportEntity="car"
    />
  );
};

export default VehicleTable;
