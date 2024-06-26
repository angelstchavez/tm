import { PiSeatFill } from "react-icons/pi";
import React from "react";

interface SelectedSeatsDisplayProps {
  selectedSeatIds: { id: string; number: number }[];
}

const SelectedSeats: React.FC<SelectedSeatsDisplayProps> = ({
  selectedSeatIds,
}) => {
  return (
    <div className="mt-2 bg-white rounded border p-1 overflow-auto">
      <h2 className="px-1 font-semibold text-white bg-yellow-600 rounded-lg text-center py-1 bg-muted">
        Asientos seleccionados
      </h2>
      <div className="flex flex-wrap justify-center">
        {selectedSeatIds.length === 0 ? (
          <div className="m-1">
            <p className="text-center text-gray-500">
              No hay asientos seleccionados
            </p>
          </div>
        ) : (
          selectedSeatIds.map((seat) => (
            <div key={seat.id} className="m-0.5">
              <div className="border border-gray-300 rounded flex items-center justify-center bg-yellow-400 w-20 h-20">
                <div className="text-center">
                  <span className="font-bold text-lg text-yellow-900">
                    {seat.number}
                  </span>
                  <br />
                  <span className="text-xl text-yellow-900">
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
