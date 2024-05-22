import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React from "react";

interface PassengersByTripProps {
  tripId: number;
}

const PassengersByTrip: React.FC<PassengersByTripProps> = ({ tripId }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>Ver pasajeros</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            <h2 className="text-xl font-bold text-gray-800 py-2">
              Pasajeros
            </h2>
          </DialogTitle>
          <DialogDescription>{tripId}</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">Hola</div>
        <DialogFooter>
          <p>Travely Manager</p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PassengersByTrip;
