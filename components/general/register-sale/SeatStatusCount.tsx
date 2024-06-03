import { PiSeatFill } from "react-icons/pi";
import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface SeatStatusCountsProps {
  tripId: number;
}

const SeatStatusCounts: React.FC<SeatStatusCountsProps> = ({ tripId }) => {
  const [statusCounts, setStatusCounts] = useState({
    Disponible: 0,
    Reservado: 0,
    Vendido: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData = JSON.parse(cookieValue);
        const token = cookieData?.data?.token;

        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `http://localhost:90/api/v1/seat/status-counts/${tripId}`, // Se utiliza tripId en la URL del endpoint
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setStatusCounts(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tripId]);

  return (
    <div className="mb-2 flex justify-center items-center border rounded-lg">
      <div className="flex justify-between max-w-xs">
        <div className="p-2 flex flex-col items-center">
          <span className="text-3xl text-zinc-300">
            <PiSeatFill />
          </span>
          <p className="text-xs text-gray-700">Libres</p>
          <p className="text-sm text-gray-700 font-bold">
            {statusCounts.Disponible}
          </p>
        </div>
        <div className="p-2 flex flex-col items-center">
          <span className="text-3xl text-zinc-600">
            <PiSeatFill />
          </span>
          <p className="text-xs text-gray-700">Reservadas</p>
          <p className="text-sm text-gray-700 font-bold">
            {statusCounts.Reservado}
          </p>
        </div>
        <div className="p-2 flex flex-col items-center">
          <span className="text-3xl text-travely-200">
            <PiSeatFill />
          </span>
          <p className="text-xs text-gray-700">Vendidas</p>
          <p className="text-sm text-gray-700 font-bold">{statusCounts.Vendido}</p>
        </div>
      </div>
    </div>
  );
};

export default SeatStatusCounts;
