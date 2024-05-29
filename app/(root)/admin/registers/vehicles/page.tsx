"use client";

import BrandCounter from "@/components/general/brands/BrandCounter";
import BrandForm from "@/components/general/brands/BrandForm";
import BrandTable from "@/components/general/brands/BrandTable";
import ModelCounter from "@/components/general/model/ModelCounter";
import ModelForm from "@/components/general/model/ModelForm";
import ModelTable from "@/components/general/model/ModelTable";
import VehicleCounter from "@/components/general/vehicles/VehicleCounter";
import VehicleForm from "@/components/general/vehicles/VehicleForm";
import VehicleTable from "@/components/general/vehicles/VehicleTable";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

const VehiclesPage: React.FC = () => {
  return (
    <>
      <Tabs defaultValue="vehicle">
        <TabsList>
          <TabsTrigger value="vehicle">Vehículos</TabsTrigger>
          <TabsTrigger value="model">Modelos</TabsTrigger>
          <TabsTrigger value="brand">Marcas</TabsTrigger>
        </TabsList>
        <TabsContent value="vehicle">
          <VehicleCounter></VehicleCounter>
          <VehicleForm></VehicleForm>
          <VehicleTable></VehicleTable>
        </TabsContent>
        <TabsContent value="model">
          <ModelCounter></ModelCounter>
          <ModelForm></ModelForm>
          <ModelTable></ModelTable>
        </TabsContent>
        <TabsContent value="brand">
          <BrandCounter></BrandCounter>
          <BrandForm></BrandForm>
          <BrandTable></BrandTable>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VehiclesPage;
