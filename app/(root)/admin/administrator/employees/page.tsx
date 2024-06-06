'use client'

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import DriverTable from '@/components/general/driver/DriverTable'
import EmployeeForm from '@/components/general/employees/EmployeeForm'
import EmployeeTable from '@/components/general/employees/EmployeeTable'
import SellerTable from '@/components/general/seller/SellerTable'
import EmployeeCounter from '@/components/general/employees/EmployeeCounter'

const EmployeesPage: React.FC = () => {
  return (
    <Tabs defaultValue='general'>
      <TabsList>
        <TabsTrigger value='general'>General</TabsTrigger>
        <TabsTrigger value='seller'>Vendedores</TabsTrigger>
        <TabsTrigger value='driver'>Conductores</TabsTrigger>
      </TabsList>
      <TabsContent value='general'>
        <EmployeeCounter></EmployeeCounter>
        <EmployeeForm></EmployeeForm>
        <EmployeeTable></EmployeeTable>
      </TabsContent>
      <TabsContent value='seller'>
        <SellerTable></SellerTable>
      </TabsContent>
      <TabsContent value='driver'>
        <DriverTable></DriverTable>
      </TabsContent>
    </Tabs>
  )
}

export default EmployeesPage
