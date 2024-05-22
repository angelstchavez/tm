import React from "react";

import UserForm from "@/components/general/users/UserForm";
import UserReport from "@/components/general/users/UserReport";
import UserTable from "@/components/general/users/UserTable";

const UserPage = () => {
  return (
    <>
      <UserForm></UserForm>
      <UserTable></UserTable>
      <UserReport></UserReport>
    </>
  );
};

export default UserPage;
