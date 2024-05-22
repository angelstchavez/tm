import React from "react";
import CustomerForm from "@/components/general/customers/CustomerForm";
import CustomerReport from "@/components/general/customers/CustomerReport";
import CustomerTable from "@/components/general/customers/CustomerTable";

const CustomersPage = () => {
  return (
    <>
      <CustomerForm></CustomerForm>
      <CustomerTable></CustomerTable>
      <CustomerReport></CustomerReport>
    </>
  );
};

export default CustomersPage;
