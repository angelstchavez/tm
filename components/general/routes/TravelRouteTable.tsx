"use client";

import React, { useState, useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import { FaEdit } from "react-icons/fa";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import { fetchData } from "@/utilities/FetchData";
import CustomTable from "@/components/utils/CustomTable";

interface City {
  id: string;
  name: string;
}

interface Department {
  id: string;
  name: string;
}

interface TravelRoute {
  id: number;
  departureCity: City;
  destinationCity: City;
  durationHours: number;
  distanceKilometers: number;
  department: Department;
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const TravelRouteTable: React.FC = () => {
  const [routes, setRoutes] = useState<TravelRoute[]>([]);
  const [originalRoutes, setOriginalRoutes] = useState<TravelRoute[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [reloadData, setReloadData] = useState<boolean>(false);

  useEffect(() => {
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-route/get-all`,
      setRoutes,
      setOriginalRoutes,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setRoutes(originalRoutes);
    } else {
      const filteredRoutes = originalRoutes.filter(
        (route) =>
          route.departureCity.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          route.destinationCity.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setRoutes(filteredRoutes);
    }
  }, [searchTerm, originalRoutes]);

  const handleRouteDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleRouteUpdate = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const columns: TableColumn<TravelRoute>[] = [
    {
      name: "Ciudad de partida",
      selector: (row) => row.departureCity.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#134b95",
      },
    },
    {
      name: "Ciudad de destino",
      selector: (row) => row.destinationCity.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "darkred",
      },
    },
    {
      name: "Duración (horas)",
      selector: (row) => row.durationHours.toString(),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Distancia (kilómetros)",
      selector: (row) => row.distanceKilometers.toString(),
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
            entity="travel-route"
            entityCamelCase="travelRoute"
            entityName={`${row.departureCity.name} - ${row.destinationCity.name}`}
            onComplete={handleRouteDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={routes}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleRouteDelete}
      exportCsvData={routes.map((route) => ({
        "Ciudad de partida": route.departureCity.name,
        "Ciudad de destino": route.destinationCity.name,
        "Duración (horas)": route.durationHours,
        "Distancia (kilómetros)": route.distanceKilometers,
      }))}
      exportCsvFileName="rutas_de_viaje.csv"
      generalReportEntity="travel-route"
      handleUpdate={handleRouteUpdate}
    />
  );
};

export default TravelRouteTable;
