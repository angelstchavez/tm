import TransportTerminalCounter from "@/components/general/transport-terminal/TransportTerminalCounter";
import TransportTerminalForm from "@/components/general/transport-terminal/TransportTerminalForm";
import TransportTerminalTable from "@/components/general/transport-terminal/TransportTerminalTable";

const TransportTerminalsPage = () => {
  return (
    <>
      <TransportTerminalCounter></TransportTerminalCounter>
      <TransportTerminalForm></TransportTerminalForm>
      <TransportTerminalTable></TransportTerminalTable>
    </>
  );
};

export default TransportTerminalsPage;
