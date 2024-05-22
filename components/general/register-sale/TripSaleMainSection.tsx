import React, { useState } from "react";
import TripDetails from "./TripDetails";
import SaleTabSection from "./SaleTabSection";
import TripPassengerDetails from "./TripPassengerDetails";
import { Button } from "@/components/ui/button";

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
        <div>
          <h2 className="text-xl font-bold text-gray-800">Registrar venta</h2>
        </div>
        <div>
          <Button variant={"outline"} onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </div>
      <div className="p-2"></div>
      <TripDetails tripId={tripId} />
      <div className="p-2"></div>
      <SaleTabSection tripId={tripId}></SaleTabSection>
    </div>
  );
};

export default TripSaleMainNavigation;
