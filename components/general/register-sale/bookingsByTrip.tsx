import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";
import DataTable from "react-data-table-component";

interface PassengersByTripProps {
  tripId: number;
}

const BookingsByTrip: React.FC<PassengersByTripProps> = ({ tripId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"link"}>Ver reservas</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold text-gray-800 py-2">Reservas</h2>
          </DialogTitle>
          <DialogDescription>
            <DataTable columns={[]} data={[]}></DataTable>
          </DialogDescription>
        </DialogHeader>
        <div className="justify-end flex">
          <Button variant={"destructive"}>Descargar PDF</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BookingsByTrip;
