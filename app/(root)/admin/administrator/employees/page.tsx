"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DriverReport from "@/components/general/driver/DriverReport";
import DriverTable from "@/components/general/driver/DriverTable";
import EmployeeForm from "@/components/general/employees/EmployeeForm";
import EmployeeTable from "@/components/general/employees/EmployeeTable";
import EmployeReport from "@/components/general/employees/EmployeReport";
import SellerReport from "@/components/general/seller/SellerReport";
import SellerTable from "@/components/general/seller/SellerTable";

const EmployeesPage: React.FC = () => {
  return (
    <>
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="seller">Vendedores</TabsTrigger>
          <TabsTrigger value="driver">Conductores</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <EmployeeForm></EmployeeForm>
          <EmployeeTable></EmployeeTable>
          <EmployeReport></EmployeReport>
        </TabsContent>
        <TabsContent value="seller">
          <SellerTable></SellerTable>
          <SellerReport></SellerReport>
        </TabsContent>
        <TabsContent value="driver">
          <DriverTable></DriverTable>
          <DriverReport></DriverReport>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EmployeesPage;
