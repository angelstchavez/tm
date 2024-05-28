import CounterModule from "@/components/utils/CounterModule";

const EmployeeCounter = () => {
  return (
    <CounterModule
      entityName={"employee"}
      module={"empleados"}
      entities={"Empleados"}
    ></CounterModule>
  );
};

export default EmployeeCounter;
