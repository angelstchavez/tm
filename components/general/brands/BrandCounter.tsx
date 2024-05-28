import CounterModule from "@/components/utils/CounterModule";

const BrandCounter = () => {
  return (
    <CounterModule
      entityName={"car-brand"}
      module={"marcas"}
      entities={"Marcas"}
    ></CounterModule>
  );
};

export default BrandCounter;
