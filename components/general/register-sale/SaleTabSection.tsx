import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeatStatusCounts from "./SeatStatusCount";
import Bus from "./Bus";
import SelectedSeats from "./SelectedSeats";
import TripDetails from "./TripDetails";
import TotalSale from "./TotalSaleCount";

interface SaleTabSectionProps {
  tripId: number;
}

const SaleTabSection: React.FC<SaleTabSectionProps> = ({ tripId }) => {
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
    <>
      <div className="flex flex-col items-center">
        <div className="w-full flex justify-center mb-4">
          <TripDetails tripId={tripId} />
        </div>
        <div className="border p-4 rounded-lg">
          <Tabs
            value={activeTab}
            onValueChange={handleTabChange}
            className="w-[480px]"
          >
            <TabsList>
              <TabsTrigger value="seats" disabled={activeTab !== "seats"}>
                1. Seleccionar asiento
              </TabsTrigger>
              <TabsTrigger
                value="passengers"
                disabled={activeTab !== "passengers"}
              >
                2. Registrar pasajeros
              </TabsTrigger>
              <TabsTrigger value="payment" disabled={activeTab !== "payment"}>
                3. Realizar pago
              </TabsTrigger>
            </TabsList>
            {/* Asientos */}
            <TabsContent value="seats">
              <div className="flex justify-center items-center">
                <div className="w-full">
                  <SeatStatusCounts tripId={tripId}></SeatStatusCounts>
                </div>
              </div>
              <div className="flex justify-center items-center">
                <div className="w-[250px]">
                  <Bus
                    tripId={tripId}
                    onSelectedSeatsChange={(selectedSeatData: {
                      id: string;
                      number: number;
                    }): void => {
                      console.log(tripId);
                    }}
                  />
                </div>
              </div>
              <div className="py-2 flex justify-center items-center">
                <div className="w-full">
                  <TotalSale count={1} tripId={tripId}></TotalSale>
                </div>
              </div>
              <div className="flex justify-end py-2">
                <Button variant={"travely"} onClick={handleNext}>
                  Siguiente
                </Button>
              </div>
            </TabsContent>
            {/* Pasajeros */}
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
            {/* Pago */}
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
      </div>
    </>
  );
};

export default SaleTabSection;
