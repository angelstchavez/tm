import * as React from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeatStatusCounts from "./SeatStatusCount";
import Bus from "./Bus";
import TripDetails from "./TripDetails";
import TotalSale from "./TotalSaleCount";
import PassengerForm from "./PassengerForm";

interface SaleTabSectionProps {
  tripId: number;
}

const SaleTabSection: React.FC<SaleTabSectionProps> = ({ tripId }) => {
  const [activeTab, setActiveTab] = React.useState("seats");
  const [selectedSeats, setSelectedSeats] = React.useState<
    { id: string; number: number }[]
  >([]);
  const [passengerFormValidity, setPassengerFormValidity] = React.useState<{
    [key: number]: boolean;
  }>({});

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

  const handleSelectedSeatsChange = (seatData: {
    id: string;
    number: number;
  }) => {
    setSelectedSeats((prevSelectedSeats) => {
      const isAlreadySelected = prevSelectedSeats.some(
        (seat) => seat.id === seatData.id
      );
      if (isAlreadySelected) {
        return prevSelectedSeats.filter((seat) => seat.id !== seatData.id);
      } else {
        return [...prevSelectedSeats, seatData];
      }
    });
  };

  const handleFormValidChange = (seatNumber: number, isValid: boolean) => {
    setPassengerFormValidity((prevState) => ({
      ...prevState,
      [seatNumber]: isValid,
    }));
  };

  const allFormsValid = React.useMemo(
    () => selectedSeats.every((seat) => passengerFormValidity[seat.number]),
    [selectedSeats, passengerFormValidity]
  );

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-[550px]"
        >
          <div className="flex justify-center items-center">
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
          </div>
          {/* Asientos */}
          <TabsContent value="seats">
            <div className="flex flex-wrap justify-center items-start">
              <div className="w-full sm:w-1/2">
                <SeatStatusCounts tripId={tripId} />
                <Bus
                  tripId={tripId}
                  onSelectedSeatsChange={handleSelectedSeatsChange}
                />
              </div>
              <div className="w-full sm:w-1/2 px-1">
                <TotalSale count={selectedSeats.length} tripId={tripId} />
                <p className="my-2 text-right text-xs text-gray-600 mb-2">
                  (Máximo 5 asientos por venta)
                </p>
                <div className="flex justify-end my-2">
                  <Button
                    variant={"travely"}
                    onClick={handleNext}
                    disabled={selectedSeats.length === 0}
                  >
                    {selectedSeats.length > 0
                      ? `Continuar con ${selectedSeats.length} ${
                          selectedSeats.length === 1 ? "silla" : "sillas"
                        }`
                      : "Continuar"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          {/* Pasajeros */}
          <TabsContent value="passengers">
            {selectedSeats.map((seat) => (
              <div key={seat.id} className="mb-4">
                <PassengerForm
                  seatNumber={seat.number}
                  onFormValidChange={handleFormValidChange}
                />
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                variant={"travely"}
                onClick={handleNext}
                disabled={!allFormsValid}
              >
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
  );
};

export default SaleTabSection;
