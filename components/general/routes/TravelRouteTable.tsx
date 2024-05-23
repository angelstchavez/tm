"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/travel-route/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener las rutas de viaje.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedRoutes = responseData.data;
        setRoutes(fetchedRoutes);
        setOriginalRoutes(fetchedRoutes);
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

  const columns: TableColumn<TravelRoute>[] = [
    {
      name: "Ciudad de partida",
      selector: (row) => row.departureCity.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
      },
    },
    {
      name: "Ciudad de destino",
      selector: (row) => row.destinationCity.name,
      sortable: true,
      style: {
        fontSize: 14,
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
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Rutas de viaje"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por ciudad de partida o destino"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={routes}
          pagination
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
      </div>
    </Section>
  );
};

export default TravelRouteTable;
