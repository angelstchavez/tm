import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/utils/Loading";
import { format } from "date-fns";
import { es } from 'date-fns/locale';

interface TotalSaleProps {
  count: number;
  tripId: number;
}

const TotalSale: React.FC<TotalSaleProps> = ({ count, tripId }) => {
  const [tripDetails, setTripDetails] = useState<any>(null);

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
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/get-by-id/${tripId}`,
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
        setTripDetails(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tripId]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(value);
  };

  if (!tripDetails) {
    return (
      <div>
        <Loading></Loading>
      </div>
    );
  }

  const formatTime = (timeString: string): string => {
    const time = timeString.split(":");
    const hours = parseInt(time[0]);
    const minutes = parseInt(time[1]);
    const meridiem = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${meridiem}`;
  };


  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return format(date, "dd-MMM-yyyy", { locale: es }).toUpperCase();
  };

  const totalPrice = tripDetails.ticketPrice * count;

  return (
    <div className="p-1 border rounded">
      <div className="bg-travely-200 text-white p-1 rounded flex justify-between">
        <span className="text-md font-bold">Información del viaje</span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-travely-200/10 text-travely-200 p-1 rounded flex justify-between">
        <span className="text-md">Origen:</span>
        <span className="text-md text-travely-200 px-1 font-semibold">
          {tripDetails.travelRoute.departureCity.name}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-travely-200/10 text-travely-200 p-1 rounded flex justify-between">
        <span className="text-md">Destino:</span>
        <span className="text-md text-travely-200 px-1 font-semibold">
          {tripDetails.travelRoute.destinationCity.name}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Fecha:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
        {formatDate(tripDetails.travelDate)}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Hora de salida:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
          {formatTime(tripDetails.travelTime)}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Duración:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
          {tripDetails.travelRoute.durationHours} horas
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Placa del autobús:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
          {tripDetails.carDriver.car.plate}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-green-700/10 text-green-700 p-1 rounded flex justify-between">
        <span className="text-md">Precio del boleto:</span>
        <span className="text-md text-green-700 px-1 font-semibold">
          {formatCurrency(tripDetails.ticketPrice)}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-green-700/10 text-green-700 p-1 rounded flex justify-between">
        <span className="text-md">Cantidad de asientos:</span>
        <span className="text-md text-green-700 px-1 font-semibold">
          {count}
        </span>
      </div>
      <div className="mt-1 bg-green-600 text-white p-1 rounded flex justify-between">
        <span className="text-md">Total:</span>
        <span className="text-md text-white px-1 font-semibold">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default TotalSale;
