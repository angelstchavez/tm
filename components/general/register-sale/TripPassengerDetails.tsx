import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";

const TripPassengerDetails = () => {
  return (
    <div className="p-4 border rounded-lg">
      {" "}
      <Tabs defaultValue="account" className="w-[480px]">
        <TabsList>
          <TabsTrigger value="passengers">Pasajeros</TabsTrigger>
          <TabsTrigger value="bookings">Reservas</TabsTrigger>
        </TabsList>
        <TabsContent value="passengers">Bus</TabsContent>
        <TabsContent value="bookings"></TabsContent>
      </Tabs>
    </div>
  );
};

export default TripPassengerDetails;
