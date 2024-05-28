import CounterModule from "@/components/utils/CounterModule";

const CustomerCounter = () => {
  return (
    <CounterModule
      entityName={"customer"}
      module={"clientes"}
      entities={"Clientes"}
    ></CounterModule>
  );
};

export default CustomerCounter;
