import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";
import Loading from "@/components/utils/Loading";

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

  const totalPrice = tripDetails.ticketPrice * count;

  return (
    <div className="p-1 border rounded">
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Precio del boleto:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
          {formatCurrency(tripDetails.ticketPrice)}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="bg-zinc-100 text-zinc-700 p-1 rounded flex justify-between">
        <span className="text-md">Cantidad de asientos:</span>
        <span className="text-md text-zinc-700 px-1 font-semibold">
          {count}
        </span>
      </div>
      <div className="py-0.5"></div>
      <div className="mt-1 bg-green-600 text-green-900 p-1 rounded flex justify-between">
        <span className="text-md">Total:</span>
        <span className="text-md text-white px-1 font-semibold">
          {formatCurrency(totalPrice)}
        </span>
      </div>
    </div>
  );
};

export default TotalSale;
