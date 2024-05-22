import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaLocationDot } from "react-icons/fa6";
import { MdAttachMoney } from "react-icons/md";

interface TripDetailsProps {
  tripId: number;
}

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

const TripDetails: React.FC<TripDetailsProps> = ({ tripId }) => {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/get-by-id/${tripId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los datos del viaje.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        setTrip(responseData.data);
        setLoading(false);
      } catch (error) {
        setError(
          typeof error === "string"
            ? error
            : "Ha ocurrido un error desconocido."
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [tripId, token]);

  if (loading) {
    return <div>Cargando datos del viaje...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!trip) {
    return <div>No se encontraron datos del viaje.</div>;
  }

  return (
    <div>
      <div className="w-[500px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2 border rounded-lg p-4">
        <p className="bg-orange-500 text-white rounded-sm p-1 flex items-center font-bold">
          <FaLocationDot className="mr-1 text-orange-300" />
          {trip.travelRoute.departureCity.name} -{" "}
          {trip.travelRoute.destinationCity.name}
        </p>
        <p className="bg-green-700 text-white rounded-sm p-1 flex items-center font-bold">
          <FaLocationDot className="mr-1 text-green-300" />
          {trip.ticketPrice.toLocaleString("es-CO", {
            style: "currency",
            currency: "COP",
          })}
        </p>
        <p>
          <span className="font-semibold">Fecha de Viaje:</span>{" "}
          {trip.travelDate.split("T")[0]}
        </p>
        <p>
          <span className="font-semibold">Hora de Viaje:</span>{" "}
          {trip.travelTime}
        </p>

        <p>
          <span className="font-semibold">Duración del Viaje:</span>{" "}
          {trip.travelRoute.durationHours} horas
        </p>
        <p>
          <span className="font-semibold">Distancia:</span>{" "}
          {trip.travelRoute.distanceKilometers} km
        </p>
      </div>
    </div>
  );
};

export default TripDetails;
