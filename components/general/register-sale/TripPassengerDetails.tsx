import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const TripPassengerDetails = () => {
  return (
    <div className="">
      {" "}
      <div>
        <h2 className="text-xl font-bold text-gray-800 py-2">
          Consultar pasajeros y reservas
        </h2>
      </div>
      <Tabs defaultValue="account" className="w-[480px]">
        <TabsList>
          <TabsTrigger value="passengers">Pasajeros</TabsTrigger>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
        </TabsList>
        <TabsContent value="passengers">Tabla de pasajeros</TabsContent>
        <TabsContent value="bookings">Tabla de reservaciones</TabsContent>
      </Tabs>
    </div>
  );
};

export default TripPassengerDetails;
