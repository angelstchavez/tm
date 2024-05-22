import UserForm from "@/components/general/users/UserForm";
import UserReport from "@/components/general/users/UserReport";
import UserTable from "@/components/general/users/UserTable";
import Section from "@/components/ui/Section";
import React from "react";

const UserPage = () => {
  return (
    <>
      <Section>
        <UserForm></UserForm>
      </Section>
      <Section>
        <UserTable></UserTable>
      </Section>
      <Section>
        <UserReport></UserReport>
      </Section>
    </>
  );
};

export default UserPage;
