import React from "react";

import TravelRouteForm from "@/components/general/routes/TravelRouteForm";
import TravelRouteReport from "@/components/general/routes/TravelRouteReport";
import TravelRouteTable from "@/components/general/routes/TravelRouteTable";

const RoutesPage = () => {
  return (
    <>
      <TravelRouteForm></TravelRouteForm>
      <TravelRouteTable></TravelRouteTable>
      <TravelRouteReport></TravelRouteReport>
    </>
  );
};

export default RoutesPage;
