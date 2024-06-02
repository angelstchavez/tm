import React, { useState } from "react";

interface SeatProps {
  id: string;
  number: number;
  status: "Disponible" | "Reservado" | "Vendido";
  onSeatClick: (seatData: { id: string; number: number }) => void;
  disabled: boolean;
}

const Seat: React.FC<SeatProps> = ({
  id,
  number,
  status,
  onSeatClick,
  disabled,
}) => {
  const [selected, setSelected] = useState<boolean>(false);

  let seatColor = "";
  let textColor = "";
  let hoverColor = "";
  switch (status) {
    case "Disponible":
      seatColor = selected ? "bg-yellow-400" : "bg-white";
      textColor = selected ? "text-yellow-800" : "text-zinc-400";
      hoverColor =
        selected && !disabled ? "hover:bg-yellow-300" : "hover:bg-gray-100";
      break;
    case "Reservado":
      seatColor = "bg-zinc-500";
      textColor = "text-white";
      hoverColor = "hover:bg-zinc-500";
      break;
    case "Vendido":
      seatColor = "bg-travely-200";
      textColor = "text-white";
      hoverColor = "hover:bg-travely-200";
      break;
    default:
      seatColor = "bg-tm00";
      textColor = "text-black";
      hoverColor = "hover:bg-gray-100";
      break;
  }

  const handleClick = () => {
    if (status === "Disponible" && !disabled) {
      setSelected(!selected);
      onSeatClick({ id, number });
    }
  };

  return (
    <div
      id={id}
      className={`border border-gray-300 rounded-md flex items-center justify-center transition-colors duration-200 cursor-pointer ${seatColor} ${hoverColor} h-10`}
      onClick={handleClick}
    >
      <span className={`font-bold text-lg ${textColor}`}>{number}</span>
    </div>
  );
};

export default Seat;
