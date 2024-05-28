import CounterModule from "@/components/utils/CounterModule";

const TransportTerminalCounter = () => {
  return (
    <CounterModule
      entityName={"transport-terminal"}
      module={"terminales"}
      entities={"Terminales"}
    ></CounterModule>
  );
};

export default TransportTerminalCounter;
