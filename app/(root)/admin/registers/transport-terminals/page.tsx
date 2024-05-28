import TransportTerminalCounter from "@/components/general/transport-terminal/TransportTerminalCounter";
import TransportTerminalForm from "@/components/general/transport-terminal/TransportTerminalForm";
import TransportTerminalReport from "@/components/general/transport-terminal/TransportTerminalReport";
import TransportTerminalTable from "@/components/general/transport-terminal/TransportTerminalTable";

const TransportTerminalsPage = () => {
  return (
    <>
      <TransportTerminalCounter></TransportTerminalCounter>
      <TransportTerminalForm></TransportTerminalForm>
      <TransportTerminalTable></TransportTerminalTable>
      <TransportTerminalReport></TransportTerminalReport>
    </>
  );
};

export default TransportTerminalsPage;
