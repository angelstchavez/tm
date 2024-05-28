import React from "react";

import TravelRouteForm from "@/components/general/routes/TravelRouteForm";
import TravelRouteReport from "@/components/general/routes/TravelRouteReport";
import TravelRouteTable from "@/components/general/routes/TravelRouteTable";
import TravelRouteCounter from "@/components/general/routes/TravelRouteCounter";

const RoutesPage = () => {
  return (
    <>
      <TravelRouteCounter></TravelRouteCounter>
      <TravelRouteForm></TravelRouteForm>
      <TravelRouteTable></TravelRouteTable>
      <TravelRouteReport></TravelRouteReport>
    </>
  );
};

export default RoutesPage;
