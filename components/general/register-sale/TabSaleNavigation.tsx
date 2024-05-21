import React from "react";
import TripDetails from "./TripDetails";

interface TabSaleNavigationProps {
  tripId: number;
}

const TabSaleNavigation: React.FC<TabSaleNavigationProps> = ({ tripId }) => {
  return (
    <div>
      <TripDetails tripId={tripId} />
    </div>
  );
};

export default TabSaleNavigation;
