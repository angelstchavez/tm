import React from "react";

import TripForm from "@/components/general/trip/TripForm";
import TripTable from "@/components/general/trip/TripTable";
import TripCounter from "@/components/general/trip/TripCounter";

const TripsPage = () => {
  return (
    <>
      <TripCounter></TripCounter>
      <TripForm></TripForm>
      <TripTable></TripTable>
    </>
  );
};

export default TripsPage;
