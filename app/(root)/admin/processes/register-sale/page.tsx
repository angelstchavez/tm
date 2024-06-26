"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Cookies from "js-cookie";
import Loading from "@/components/utils/Loading";
import DataTable, { TableColumn } from "react-data-table-component";
import TripSaleMainNavigation from "@/components/general/register-sale/TripSaleMainSection";
import CustomTitle from "@/components/utils/CustomTitle";
import Section from "@/components/ui/Section";
import SearchSeatsButton from "@/components/general/register-sale/SearchSeatsButton";

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

const NoDataComponent = () => (
  <p className="text-red-600 font-bold">
    No se encuentran resultados de tu búsqueda
  </p>
);

const RegisterSalePage: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [filteredTrips, setFilteredTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [origin, setOrigin] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [viewSeatsEnabled, setViewSeatsEnabled] = useState<boolean>(true);

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
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Ha ocurrido un error desconocido."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  useEffect(() => {
    const filtered = trips.filter((trip) => {
      let match = true;
      if (origin) {
        match =
          match &&
          (trip.travelRoute.departureCity.name
            .toLowerCase()
            .includes(origin.toLowerCase()) ||
            trip.travelRoute.destinationCity.name
              .toLowerCase()
              .includes(origin.toLowerCase()));
      }
      if (date) {
        const tripDate = trip.travelDate.split("T")[0];
        match = match && tripDate === date;
      }
      if (time) {
        const tripTime = trip.travelTime.slice(0, 5);
        match = match && tripTime === time;
      }
      return match;
    });
    setFilteredTrips(filtered);
  }, [origin, date, time, trips]);

  const handleViewSeats = (id: number) => {
    setSelectedTripId(id);
    setViewSeatsEnabled(false);
  };

  const handleCancel = () => {
    setSelectedTripId(null);
    setViewSeatsEnabled(true);
  };

  const columns: TableColumn<Trip>[] = [
    {
      name: "Origen",
      selector: (row) => row.travelRoute.departureCity.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#134b95",
      },
    },
    {
      name: "Destino",
      selector: (row) => row.travelRoute.destinationCity.name,
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "darkred",
      },
    },
    {
      name: "Fecha de Viaje",
      sortable: true,
      selector: (row) => {
        const date = new Date(row.travelDate);
        return date.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        });
      },
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Hora de Viaje",
      sortable: true,
      selector: (row) => {
        const time = new Date(`1970-01-01T${row.travelTime}`);
        return time.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
      },
      style: {
        fontSize: 14,
      },
    },
    {
      name: "Precio del Boleto",
      sortable: true,
      style: {
        fontSize: 14,
        fontWeight: "bold",
        color: "darkgreen",
      },
      selector: (row) => {
        return row.ticketPrice.toLocaleString("es-CO", {
          style: "currency",
          currency: "COP",
        });
      },
    },
    {
      name: "Ver Sillas",
      cell: (row) => (
        <SearchSeatsButton
          onClick={() => handleViewSeats(row.id)}
          disabled={!viewSeatsEnabled}
        />
      ),
    },
  ];

  return (
    <>
      <Section>
        <CustomTitle title={"Consultar viajes disponibles"}></CustomTitle>
        <div className="flex flex-col md:flex-row w-full max-w-4xl items-center gap-4 py-2">
          <div className="w-full md:flex-1">
            <Label htmlFor="origin">Origen o destino</Label>
            <Input
              type="text"
              id="origin"
              placeholder="Ej. Bogotá"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:flex-1">
            <Label htmlFor="date">Fecha de viaje</Label>
            <Input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="w-full md:flex-1">
            <Label htmlFor="time">Hora de viaje</Label>
            <Input
              type="time"
              id="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </Section>
      <Section>
        <div className="grid grid-col-1">
          <DataTable
            columns={columns}
            data={filteredTrips}
            pagination
            paginationPerPage={10}
            fixedHeader
            progressPending={loading}
            progressComponent={<Loading />}
            noDataComponent={<NoDataComponent />}
          />
        </div>
      </Section>
      {selectedTripId && (
        <div className="justify-center items-center flex">
          <section className="h-auto rounded-md bg-white shadow-md border p-4 flex flex-col">
            <TripSaleMainNavigation
              tripId={selectedTripId}
              onCancel={handleCancel}
            ></TripSaleMainNavigation>
          </section>
        </div>
      )}
    </>
  );
};

export default RegisterSalePage;
