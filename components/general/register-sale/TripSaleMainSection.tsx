import React from "react";
import TripDetails from "./TripDetails";
import SaleTabSection from "./SaleTabSection";
import TripPassengerDetails from "./TripPassengerDetails";

interface TabSaleNavigationProps {
  tripId: number;
}

const TripSaleMainNavigation: React.FC<TabSaleNavigationProps> = ({
  tripId,
}) => {
  return (
    <div>
      <TripDetails tripId={tripId} />
      <div className="p-2"></div>
      <SaleTabSection></SaleTabSection>
      <div className="p-2"></div>
      <TripPassengerDetails></TripPassengerDetails>
    </div>
  );
};

export default TripSaleMainNavigation;
