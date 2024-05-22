import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const SaleTabSection = () => {
  const [activeTab, setActiveTab] = React.useState("seats");

  const handleNext = () => {
    if (activeTab === "seats") setActiveTab("passengers");
    else if (activeTab === "passengers") setActiveTab("payment");
  };

  const handleBack = () => {
    if (activeTab === "passengers") setActiveTab("seats");
    else if (activeTab === "payment") setActiveTab("passengers");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div className="flex justify-center items-center py-4 border rounded-lg">
      <Tabs
        value={activeTab}
        onValueChange={handleTabChange}
        className="w-[480px]"
      >
        <TabsList>
          <TabsTrigger value="seats" disabled={activeTab !== "seats"}>
            1. Seleccionar asiento
          </TabsTrigger>
          <TabsTrigger value="passengers" disabled={activeTab !== "passengers"}>
            2. Registrar pasajeros
          </TabsTrigger>
          <TabsTrigger value="payment" disabled={activeTab !== "payment"}>
            3. Realizar pago
          </TabsTrigger>
        </TabsList>
        <TabsContent value="seats">
          <h2 className="py-2 text-xl font-bold text-gray-800">
            Seleccione los asientos
          </h2>
          <div className="flex justify-end">
            <Button variant={"travely"} onClick={handleNext}>
              Siguiente
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="passengers">
          <h2 className="py-2 text-xl font-bold text-gray-800">
            Registrar pasajeros
          </h2>
          <div className="flex justify-between">
            <Button variant={"secondary"} onClick={handleBack}>
              Volver
            </Button>
            <Button variant={"travely"} onClick={handleNext}>
              Siguiente
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="payment">
          <h2 className="py-2 text-xl font-bold text-gray-800">
            Finalizar pago
          </h2>
          <div className="flex justify-between">
            <Button variant={"secondary"} onClick={handleBack}>
              Volver
            </Button>
            <Button variant={"confirm"}>Pagar</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SaleTabSection;
