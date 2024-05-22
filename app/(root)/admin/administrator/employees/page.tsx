"use client";

import Section from "@/components/ui/Section";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import React from "react";

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
          <Section>
            <h2 className="text-xl font-bold text-gray-800">
              Registrar empleado
            </h2>
            {/* Contenido específico para la sección de empleados */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">empleados</h2>
            {/* Contenido específico para la sección de empleados */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de empleados */}
          </Section>
        </TabsContent>
        <TabsContent value="seller">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Vendedores</h2>
            {/* Contenido específico para la sección de Vendedores */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de Vendedores */}
          </Section>
        </TabsContent>
        <TabsContent value="driver">
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Conductores</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
          <Section>
            <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
            {/* Contenido específico para la sección de Conductores */}
          </Section>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default EmployeesPage;
