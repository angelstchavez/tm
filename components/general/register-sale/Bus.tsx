import React, { useEffect, useState } from "react";
import Seat from "./Seat";
import { getToken } from "@/lib/GetToken";

interface SeatData {
  id: string;
  number: number;
  status: "Disponible" | "Reservado" | "Vendido";
  tripId: number;
}

interface BusProps {
  tripId: number;
  onSelectedSeatsChange: (selectedSeatData: {
    id: string;
    number: number;
  }) => void;
}

const Bus: React.FC<BusProps> = ({ tripId, onSelectedSeatsChange }) => {
  const [seats, setSeats] = useState<SeatData[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; number: number }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/seat/get-by-trip/${tripId}`,
          {
            method: "GET",
            headers: {
              Accept: "*/*",
              Authorization: `Bearer ${getToken()}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setSeats(data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [tripId]);

  const thirdLength = Math.ceil(seats.length / 4);
  const firstThird = seats.slice(0, thirdLength);
  const secondThird = seats.slice(thirdLength, thirdLength * 2);
  const thirdSection = seats.slice(thirdLength * 2, thirdLength * 3);
  const fourthSection = seats.slice(thirdLength * 3);

  const handleSeatClick = (seatData: { id: string; number: number }) => {
    setSelectedSeats((prevSelectedSeats) => {
      const isAlreadySelected = prevSelectedSeats.some(
        (seat) => seat.id === seatData.id
      );
      if (isAlreadySelected) {
        return prevSelectedSeats.filter((seat) => seat.id !== seatData.id);
      } else if (prevSelectedSeats.length < 5) {
        return [...prevSelectedSeats, seatData];
      }
      return prevSelectedSeats;
    });
    onSelectedSeatsChange(seatData);
  };

  const isSelectionDisabled = selectedSeats.length >= 5;

  return (
    <div className="border rounded-xl">
      <div className="bg-zinc-200 w-full h-2 border-t border-l border-r border-zinc-200 rounded-t-full"></div>{" "}
      <div className="grid grid-cols-5">
        <div className="col-span-2 h-8 bg-zinc-300 flex items-center justify-center">
          <div className="text-center text-zinc-600 font-bold text-xs">
            Conductor
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-8 bg-zinc-100 flex items-center justify-center">
          <div className="text-center text-zinc-600 font-bold text-xs">
            Auxiliar
          </div>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-2 p-2">
        <div className="col-span-1">
          {firstThird.map((seat, index) => (
            <div
              key={seat.id}
              className={`mb-2 ${
                index !== firstThird.length - 1 ? "mb-2" : ""
              }`}
            >
              <Seat
                id={seat.id}
                number={seat.number}
                status={seat.status}
                onSeatClick={handleSeatClick}
                disabled={
                  isSelectionDisabled &&
                  !selectedSeats.some((s) => s.id === seat.id)
                }
              />
            </div>
          ))}
        </div>
        <div className="col-span-1">
          {secondThird.map((seat, index) => (
            <div
              key={seat.id}
              className={`mb-2 ${
                index !== secondThird.length - 1 ? "mb-2" : ""
              }`}
            >
              <Seat
                id={seat.id}
                number={seat.number}
                status={seat.status}
                onSeatClick={handleSeatClick}
                disabled={
                  isSelectionDisabled &&
                  !selectedSeats.some((s) => s.id === seat.id)
                }
              />
            </div>
          ))}
        </div>
        <div className="col-span-1 bg-zinc-100 rounded-md mb-1"></div>
        <div className="col-span-1">
          {thirdSection.map((seat, index) => (
            <div
              key={seat.id}
              className={`mb-2 ${
                index !== thirdSection.length - 1 ? "mb-2" : ""
              }`}
            >
              <Seat
                id={seat.id}
                number={seat.number}
                status={seat.status}
                onSeatClick={handleSeatClick}
                disabled={
                  isSelectionDisabled &&
                  !selectedSeats.some((s) => s.id === seat.id)
                }
              />
            </div>
          ))}
        </div>
        <div className="col-span-1">
          {fourthSection.map((seat, index) => (
            <div
              key={seat.id}
              className={`mb-2 ${
                index !== fourthSection.length - 1 ? "mb-2" : ""
              }`}
            >
              <Seat
                id={seat.id}
                number={seat.number}
                status={seat.status}
                onSeatClick={handleSeatClick}
                disabled={
                  isSelectionDisabled &&
                  !selectedSeats.some((s) => s.id === seat.id)
                }
              />
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-5">
        <div className="col-span-2 h-8 bg-zinc-100 flex items-center justify-center">
          <div className="text-center text-zinc-600 font-bold text-xs">
            Baño
          </div>
        </div>
        <div className="col-span-1"></div>
        <div className="col-span-2 h-8 bg-zinc-100 flex items-center justify-center">
          <div className="text-center text-zinc-600 font-bold text-xs">
            Baño
          </div>
        </div>
      </div>
      <div className="bg-zinc-200 w-full h-2 border-b border-l border-r border-zinc-200 rounded-b-full"></div>{" "}
    </div>
  );
};

export default Bus;
