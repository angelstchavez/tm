import { PiSeatFill } from "react-icons/pi";
import React from "react";

interface SelectedSeatsDisplayProps {
  selectedSeatIds: { id: string; number: number }[];
}

const SelectedSeats: React.FC<SelectedSeatsDisplayProps> = ({
  selectedSeatIds,
}) => {
  return (
    <div className="mt-2 bg-white rounded-lg border p-1 overflow-auto">
      <h2 className="px-1 font-semibold bg-tm20 rounded-lg text-center p-1 bg-muted">
        Asientos seleccionados
      </h2>
      <div className="flex flex-wrap">
        {selectedSeatIds.length === 0 ? (
          <div className="m-1">
            <p className="text-center text-gray-500">
              No hay asientos seleccionados
            </p>
          </div>
        ) : (
          selectedSeatIds.map((seat) => (
            <div key={seat.id} className="m-0.5">
              <div className="mt-0.5 border border-gray-300 rounded-md flex items-center justify-center bg-tm40 w-20 h-24">
                <div className="items-center">
                  <span className="font-bold text-xl text-white">
                    {seat.number}
                  </span>
                  <br />
                  <span className="text-2xl">
                    <PiSeatFill />
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SelectedSeats;
