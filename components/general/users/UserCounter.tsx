import CounterModule from "@/components/utils/CounterModule";

const UserCounter = () => {
  return (
    <CounterModule
      entityName={"user"}
      module={"usuarios"}
      entities={"Usuarios"}
    ></CounterModule>
  );
};

export default UserCounter;
