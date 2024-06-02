import React, { useState } from "react";
import TripDetails from "./TripDetails";
import SaleTabSection from "./SaleTabSection";
import { Button } from "@/components/ui/button";
import PassengersByTrip from "./PassengersByTrip";
import BookingsByTrip from "./bookingsByTrip";

interface TabSaleNavigationProps {
  tripId: number;
  onCancel: () => void;
}

const TripSaleMainNavigation: React.FC<TabSaleNavigationProps> = ({
  tripId,
  onCancel,
}) => {
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex-grow">
          <h2 className="text-xl font-bold text-gray-800">Registrar venta</h2>
        </div>
        <div className="ml-1">
          <PassengersByTrip tripId={tripId}></PassengersByTrip>
        </div>
        <div className="ml-1">
          <BookingsByTrip tripId={tripId}></BookingsByTrip>
        </div>
        <div className="ml-1">
          <Button variant={"outline"} onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
      <div className="p-1"></div>
      <SaleTabSection tripId={tripId}></SaleTabSection>
    </div>
  );
};

export default TripSaleMainNavigation;
