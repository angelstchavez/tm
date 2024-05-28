import CounterModule from "@/components/utils/CounterModule";

const TravelRouteCounter = () => {
  return (
    <CounterModule
      entityName={"travel-route"}
      module={"rutas"}
      entities={"Rutas"}
    ></CounterModule>
  );
};

export default TravelRouteCounter;
