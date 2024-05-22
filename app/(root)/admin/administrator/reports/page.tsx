"use client";

import React from "react";
import Section from "@/components/ui/Section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";

const ReportsPage: React.FC = () => {
  return (
    <>
      <Tabs defaultValue="today">
        <TabsList>
          <TabsTrigger value="today">Hoy</TabsTrigger>
          <TabsTrigger value="weekly">Semanal</TabsTrigger>
          <TabsTrigger value="monthly">Mensual</TabsTrigger>
          <TabsTrigger value="general">General</TabsTrigger>
        </TabsList>
        <TabsContent value="today">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte del día</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
        </TabsContent>
        <TabsContent value="weekly">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte semanal</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
        </TabsContent>
        <TabsContent value="monthly">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte mensual</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
        </TabsContent>
        <TabsContent value="general">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte general</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReportsPage;
