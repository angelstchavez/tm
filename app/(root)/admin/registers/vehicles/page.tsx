"use client";

import BrandForm from "@/components/general/brands/BrandForm";
import BrandReport from "@/components/general/brands/BrandReport";
import BrandTable from "@/components/general/brands/BrandTable";
import ModelForm from "@/components/general/model/ModelForm";
import ModelReport from "@/components/general/model/ModelReport";
import ModelTable from "@/components/general/model/ModelTable";
import VehicleForm from "@/components/general/vehicles/VehicleForm";
import VehicleReport from "@/components/general/vehicles/VehicleReport";
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
          <VehicleForm></VehicleForm>
          <VehicleTable></VehicleTable>
          <VehicleReport></VehicleReport>
        </TabsContent>
        <TabsContent value="model">
          <ModelForm></ModelForm>
          <ModelTable></ModelTable>
          <ModelReport></ModelReport>
        </TabsContent>
        <TabsContent value="brand">
          <BrandForm></BrandForm>
          <BrandTable></BrandTable>
          <BrandReport></BrandReport>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VehiclesPage;
