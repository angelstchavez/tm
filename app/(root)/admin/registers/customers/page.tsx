import React from "react";
import CustomerForm from "@/components/general/customers/CustomerForm";
import CustomerTable from "@/components/general/customers/CustomerTable";
import CustomerCounter from "@/components/general/customers/CustomerCounter";

const CustomersPage = () => {
  return (
    <>
      <CustomerCounter></CustomerCounter>
      <CustomerForm></CustomerForm>
      <CustomerTable></CustomerTable>
    </>
  );
};

export default CustomersPage;
