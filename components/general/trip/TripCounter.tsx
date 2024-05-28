import CounterModule from "@/components/utils/CounterModule";

const TripCounter = () => {
  return (
    <CounterModule
      entityName={"trip"}
      module={"viajes"}
      entities={"Viajes"}
    ></CounterModule>
  );
};

export default TripCounter;
