"use client";

import Section from "@/components/ui/Section";
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
          <Section>
            <h2 className="text-xl font-bold text-gray-800">
              Registrar vehículo
            </h2>
            {/* Contenido específico para la sección de vehículos */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Vehículos</h2>
            {/* Contenido específico para la sección de vehículos */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de vehículos */}
          </Section>
        </TabsContent>
        <TabsContent value="model">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">
              Registrar modelo
            </h2>
            {/* Contenido específico para la sección de modelos */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Modelos</h2>
            {/* Contenido específico para la sección de modelos */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de modelos */}
          </Section>
        </TabsContent>
        <TabsContent value="brand">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Registrar marca</h2>
            {/* Contenido específico para la sección de marcas */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Marcas</h2>
            {/* Contenido específico para la sección de marcas */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de marcas */}
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default VehiclesPage;
