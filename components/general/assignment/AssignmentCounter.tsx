import CounterModule from "@/components/utils/CounterModule";

const AssignmentCounter = () => {
  return (
    <CounterModule
      entityName={"employee"}
      module={"empleados"}
      entities={"Empleados"}
    ></CounterModule>
  );
};

export default AssignmentCounter;
