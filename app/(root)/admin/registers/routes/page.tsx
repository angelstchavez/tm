import React from "react";

import TravelRouteForm from "@/components/general/routes/TravelRouteForm";
import TravelRouteTable from "@/components/general/routes/TravelRouteTable";
import TravelRouteCounter from "@/components/general/routes/TravelRouteCounter";

const RoutesPage = () => {
  return (
    <>
      <TravelRouteCounter></TravelRouteCounter>
      <TravelRouteForm></TravelRouteForm>
      <TravelRouteTable></TravelRouteTable>
    </>
  );
};

export default RoutesPage;
