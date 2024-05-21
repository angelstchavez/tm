import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import PassengerForm from "./PassengerForm";

const SaleTabSection = () => {
  return (
    <div className="flex justify-center items-center py-4 border rounded-lg">
      <Tabs defaultValue="account" className="w-[480px]">
        <TabsList className="flex justify-center">
          <TabsTrigger value="seats">1. Seleccionar asiento</TabsTrigger>
          <TabsTrigger value="passengers">2. Registrar pasajeros</TabsTrigger>
          <TabsTrigger value="payment">3. Realizar pago</TabsTrigger>
        </TabsList>
        <TabsContent value="seats">Bus</TabsContent>
        <TabsContent value="passengers">
          <PassengerForm seatNumber={0}></PassengerForm>
        </TabsContent>
        <TabsContent value="payment">Pago</TabsContent>
      </Tabs>
    </div>
  );
};

export default SaleTabSection;
