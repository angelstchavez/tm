import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeatStatusCounts from "./SeatStatusCount";
import Bus from "./Bus";
import TotalSale from "./TotalSaleCount";
import PassengerForm from "./PassengerForm";
import PaymentForm from "./PaymentForm";
import Cookies from "js-cookie";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SaleTabSectionProps {
  tripId: number;
}

interface PassengerData {
  names: string;
  surnames: string;
  identificationType: string;
  identificationNumber: string;
}

interface PaymentFormData {
  names: string;
  surnames: string;
  identificationType: string;
  identificationNumber: string;
  gender: string;
  birthDate: string;
  email: string;
  mobilePhone: string;
  paymentMethod: string;
  amountGivenByCustomer: number;
}

const SaleTabSection: React.FC<SaleTabSectionProps> = ({ tripId }) => {
  const [activeTab, setActiveTab] = useState<string>("seats");
  const [selectedSeats, setSelectedSeats] = useState<
    { id: string; number: number }[]
  >([]);
  const [passengerFormValidity, setPassengerFormValidity] = useState<{
    [key: number]: boolean;
  }>({});
  const [passengerData, setPassengerData] = useState<{
    [key: number]: PassengerData;
  }>({});
  const [paymentFormData, setPaymentFormData] =
    useState<PaymentFormData | null>(null);

  useEffect(() => {
    setPaymentFormData(paymentFormData);
  }, [paymentFormData]);

  const handleNext = () => {
    if (activeTab === "seats") {
      setActiveTab("passengers");
    } else if (activeTab === "passengers") {
      setActiveTab("payment");
    }
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

  const handlePassengerFormSubmit = (
    data: PassengerData,
    seatNumber: number
  ) => {
    setPassengerData((prevState) => ({
      ...prevState,
      [seatNumber]: data,
    }));
  };

  const handlePassengerFormDataChange = (
    seatNumber: number,
    data: PassengerData
  ) => {
    setPassengerData((prevState) => ({
      ...prevState,
      [seatNumber]: data,
    }));
  };

  const allFormsValid = selectedSeats.every(
    (seat) => passengerFormValidity[seat.number]
  );

  const handlePayment = async (): Promise<void> => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
      const cookieData = JSON.parse(cookieValue);
      const token = cookieData?.data?.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const passengersList = Object.values(passengerData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket-sale/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
          body: JSON.stringify({
            seatIds: selectedSeats.map((seat) => seat.id),
            passengers: passengersList,
            tripId: tripId,
            paymentMethodId: paymentFormData?.paymentMethod,
            amountGivenByCustomer: paymentFormData?.amountGivenByCustomer,
            customerModel: {
              person: {
                names: paymentFormData?.names,
                surnames: paymentFormData?.surnames,
                identificationType: paymentFormData?.identificationType,
                identificationNumber: paymentFormData?.identificationNumber,
                gender: paymentFormData?.gender,
                birthdate: paymentFormData?.birthDate,
                email: paymentFormData?.email,
                mobilePhone: paymentFormData?.mobilePhone,
                createdAt: new Date().toISOString(),
              },
              createdAt: new Date().toISOString(),
            },
          }),
        }
      );

      if (!response.ok) {
        const responseData = await response.json();
        throw new Error(responseData.data || "Error al crear la venta.");
      }

      window.location.reload();
    } catch (error: any) {
      console.error("Error al procesar el pago:", error.message);
    }
  };

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
              <div className="w-full sm:w-1/2 px-2">
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
                  onSubmit={handlePassengerFormSubmit}
                  onFormDataChange={handlePassengerFormDataChange}
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
            <PaymentForm
              formData={paymentFormData}
              setFormData={setPaymentFormData}
              handlePayment={handlePayment}
              tripId={tripId}
              totalCount={selectedSeats.length}
            ></PaymentForm>
            <div className="mt-4 flex justify-end">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="travely">finalizar</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>¿Desea registrar esta venta?</DialogTitle>
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex justify-between space-x-2">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <Dialog>
                        <DialogTrigger>
                          <Button variant="confirm" onClick={handlePayment}>
                            Confirmar
                          </Button>
                        </DialogTrigger>
                      </Dialog>
                    </div>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SaleTabSection;
