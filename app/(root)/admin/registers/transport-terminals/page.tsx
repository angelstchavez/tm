import TransportTerminalForm from "@/components/general/transport-terminal/TransportTerminalForm";
import TransportTerminalReport from "@/components/general/transport-terminal/TransportTerminalReport";
import TransportTerminalTable from "@/components/general/transport-terminal/TransportTerminalTable";
import React from "react";

const TransportTerminalsPage = () => {
  return (
    <>
      <TransportTerminalForm></TransportTerminalForm>
      <TransportTerminalTable></TransportTerminalTable>
      <TransportTerminalReport></TransportTerminalReport>
    </>
  );
};

export default TransportTerminalsPage;
