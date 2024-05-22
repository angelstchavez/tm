"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import TodayReport from "@/components/general/reports/TodayReport";
import WeeklyReport from "@/components/general/reports/WeeklyReport";
import MonthlyReport from "@/components/general/reports/MonthlyReport";
import GeneralReport from "@/components/general/reports/GeneralReport";

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
          <TodayReport></TodayReport>
        </TabsContent>
        <TabsContent value="weekly">
          <WeeklyReport></WeeklyReport>
        </TabsContent>
        <TabsContent value="monthly">
          <MonthlyReport></MonthlyReport>
        </TabsContent>
        <TabsContent value="general">
          <GeneralReport></GeneralReport>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default ReportsPage;
