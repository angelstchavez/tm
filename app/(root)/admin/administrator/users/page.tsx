import React from "react";

import UserForm from "@/components/general/users/UserForm";
import UserTable from "@/components/general/users/UserTable";
import UserCounter from "@/components/general/users/UserCounter";

const UserPage = () => {
  return (
    <>
      <UserCounter></UserCounter>
      <UserForm></UserForm>
      <UserTable></UserTable>
    </>
  );
};

export default UserPage;
