"use client";

import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import DataTable, { TableColumn } from "react-data-table-component";
import Loading from "@/components/utils/Loading";
import { FaEdit } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import Section from "@/components/ui/Section";
import { DeleteEntityDialog } from "@/components/api/DeleteEntity";
import CustomTitle from "@/components/utils/CustomTitle";
import ExportCsvButton from "@/components/utils/ExportCsvButton";
import GeneralReport from "@/components/utils/GeneralReport";

interface Trip {
  id: number;
  travelDate: string;
  travelTime: string;
  ticketPrice: number;
  isActive: boolean;
  createdAt: string;
  travelRoute: {
    departureCity: {
      name: string;
    };
    destinationCity: {
      name: string;
    };
  };
}

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const TripTable: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [originalTrips, setOriginalTrips] = useState<Trip[]>([]);
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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/get-all`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los viajes.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        const fetchedTrips = responseData.data;
        setTrips(fetchedTrips);
        setOriginalTrips(fetchedTrips);
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
      setTrips(originalTrips);
    } else {
      const filteredTrips = originalTrips.filter((trip) =>
        `${trip.travelRoute.departureCity.name} ${trip.travelRoute.destinationCity.name}`
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      );
      setTrips(filteredTrips);
    }
  }, [searchTerm, originalTrips]);

  const handleTripDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${
      minutes < 10 ? `0${minutes}` : minutes
    } ${period}`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(amount);
  };

  const columns: TableColumn<Trip>[] = [
    {
      name: "Fecha de Viaje",
      selector: (row) => {
        const date = new Date(row.travelDate);
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
      name: "Hora de Viaje",
      selector: (row) => formatTime(row.travelTime),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Precio del Boleto",
      selector: (row) => formatCurrency(row.ticketPrice),
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Origen",
      selector: (row) => row.travelRoute.departureCity.name,
      sortable: true,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Destino",
      selector: (row) => row.travelRoute.destinationCity.name,
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
      cell: (row) => (
        <div className="flex space-x-2">
          <button className="bg-orange-600 rounded text-white p-1">
            <FaEdit className="text-xl" />
          </button>
          <DeleteEntityDialog
            entityId={row.id}
            entity="trip"
            entityCamelCase="trip"
            entityName={`${row.travelRoute.departureCity.name} - ${row.travelRoute.destinationCity.name}`}
            onComplete={handleTripDelete}
          />
        </div>
      ),
    },
  ];

  return (
    <Section>
      <div className="flex items-center justify-between">
        <CustomTitle title={"Viajes"} />
        <div className="w-1/2 max-w-md py-2">
          <Input
            type="text"
            placeholder="Buscar por origen o destino"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      {error && <div className="text-red-600 mb-4">Error: {error}</div>}
      <div className="grid grid-col-1">
        <DataTable
          columns={columns}
          data={trips}
          pagination
          progressPending={loading}
          progressComponent={<Loading />}
          noDataComponent={<NoDataComponent />}
        />
        <div className="flex items-center justify-end mt-2">
          <div className="mr-2">
            <ExportCsvButton
              data={trips.map((trip) => ({
                "Fecha de Viaje": new Date(trip.travelDate).toLocaleDateString(
                  "es-CO"
                ),
                "Hora de Viaje": formatTime(trip.travelTime),
                "Precio del Boleto": formatCurrency(trip.ticketPrice),
                Origen: trip.travelRoute.departureCity.name,
                Destino: trip.travelRoute.destinationCity.name,
                "Fecha de Registro": new Date(
                  trip.createdAt
                ).toLocaleDateString("es-CO"),
              }))}
              fileName="viajes.csv"
            />
          </div>
          <div>
            <GeneralReport entity={"trip"}></GeneralReport>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default TripTable;
