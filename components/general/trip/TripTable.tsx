"use client";

import React, { useState, useEffect } from "react";
import { TableColumn } from "react-data-table-component";
import ActionButtons from "@/components/utils/ActionButtons";
import { fetchData } from "@/utilities/FetchData";
import CustomTable from "@/components/utils/CustomTable";

interface Trip {
  id: number;
  travelDate: string;
  travelTime: string;
  ticketPrice: number;
  travelRoute: {
    departureCity: {
      name: string;
    };
    destinationCity: {
      name: string;
    };
  };
  createdAt: string;
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
    fetchData(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/get-all`,
      setTrips,
      setOriginalTrips,
      setError,
      setLoading
    );
  }, [reloadData]);

  useEffect(() => {
    if (searchTerm === "") {
      setTrips(originalTrips);
    } else {
      const filteredTrips = originalTrips.filter(
        (trip) =>
          trip.travelRoute.departureCity.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          trip.travelRoute.destinationCity.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
      setTrips(filteredTrips);
    }
  }, [searchTerm, originalTrips]);

  const handleTripDelete = () => {
    setReloadData((prevReloadData) => !prevReloadData);
  };

  const handleTripUpdate = () => {
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
        <ActionButtons
          row={row}
          onEdit={() => {}}
          onDelete={handleTripDelete}
          entity="trip"
          entityCamelCase="trip"
          entityName={`${row.travelRoute.departureCity.name} - ${row.travelRoute.destinationCity.name}`}
        />
      ),
    },
  ];

  return (
    <CustomTable
      columns={columns}
      data={trips}
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      loading={loading}
      error={error}
      NoDataComponent={NoDataComponent}
      handleDelete={handleTripDelete}
      handleUpdate={handleTripUpdate}
      exportCsvData={trips.map((trip) => ({
        "Fecha de Viaje": new Date(trip.travelDate).toLocaleDateString("es-CO"),
        "Hora de Viaje": formatTime(trip.travelTime),
        "Precio del Boleto": formatCurrency(trip.ticketPrice),
        Origen: trip.travelRoute.departureCity.name,
        Destino: trip.travelRoute.destinationCity.name,
        "Fecha de Registro": new Date(trip.createdAt).toLocaleDateString(
          "es-CO"
        ),
      }))}
      exportCsvFileName="viajes.csv"
      generalReportEntity="trip"
    />
  );
};

export default TripTable;
