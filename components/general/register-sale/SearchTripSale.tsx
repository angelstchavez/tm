"use client";

import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/utils/Loading";
import DataTable, { TableColumn } from "react-data-table-component";
import { FaClock, FaTicketAlt } from "react-icons/fa";

interface Trip {
  id: number;
  travelDate: string;
  travelTime: string;
  ticketPrice: number;
  isActive: boolean;
  createdAt: string;
  travelRoute: {
    durationHours: number;
    distanceKilometers: number;
    departureCity: {
      id: number;
      name: string;
    };
    destinationCity: {
      id: number;
      name: string;
    };
  };
  carDriver: {
    car: {
      plate: string;
    };
  };
}

const SearchTripSale = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
  const cookieData = cookieValue ? JSON.parse(cookieValue) : null;
  const token = cookieData?.data?.token;

  useEffect(() => {
    const fetchData = async () => {
      try {
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
          throw new Error("Error al obtener los datos de los viajes.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        setTrips(responseData.data);
        setFilteredTrips(responseData.data);
        setLoading(false);
      } catch (error) {
        if (typeof error === "string") {
          setError(error);
        } else {
          setError("Ha ocurrido un error desconocido.");
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleViewSeats = (id: number) => {
    console.log(`Ver sillas del viaje con ID: ${id}`);
  };

  const columns: TableColumn<Trip>[] = [
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
      name: "Fecha de Viaje",
      sortable: true,
      selector: (row) => row.travelDate,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Hora de Viaje",
      sortable: true,
      selector: (row) => row.travelTime,
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Duración",
      sortable: true,
      style: {
        fontSize: 14,
      },
      cell: (row) => (
        <div className="py-1 p-1 flex items-center rounded bg-zinc-100 text-zinc-800 font-semibold">
          <span className="mr-1">
            <FaClock />
          </span>
          <span>{row.travelRoute.durationHours} horas</span>
        </div>
      ),
    },
    {
      name: "Distancia",
      sortable: true,
      style: {
        fontSize: 14,
      },
      cell: (row) => (
        <div className="py-1 p-1 flex items-center rounded bg-zinc-100 text-zinc-800 font-semibold">
          <span className="mr-1">
            <FaClock />
          </span>
          <span>{row.travelRoute.distanceKilometers} Km</span>
        </div>
      ),
    },
    {
      name: "Precio del Boleto",
      sortable: true,
      style: {
        fontSize: 14,
        width: "400px",
      },
      cell: (row) => (
        <div className="py-1 p-1 flex items-center rounded bg-green-100 text-green-900 font-semibold">
          <span className="mr-1">
            <FaTicketAlt />
          </span>
          <span>
            {row.ticketPrice.toLocaleString("es-CO", {
              style: "currency",
              currency: "COP",
            })}
          </span>
        </div>
      ),
    },
    {
      name: "Ver Sillas",
      cell: (row) => (
        <button
          className="bg-tm20 hover:bg-tm10 text-white font-semibold py-2 px-4 rounded"
          onClick={() => handleViewSeats(row.id)}
        >
          Ver sillas
        </button>
      ),
    },
  ];

  return (
    <div>
      <div className="grid grid-col-1 border rounded">
        <DataTable
          columns={columns}
          data={filteredTrips}
          pagination
          paginationPerPage={10}
          fixedHeader
          progressPending={loading}
          progressComponent={<Loading />}
        />
      </div>
    </div>
  );
};

export default SearchTripSale;
