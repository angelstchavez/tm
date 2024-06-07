import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import SeatStatusCounts from "./SeatStatusCount";
import Bus from "./Bus";
import TotalSale from "./TotalSaleCount";
import PassengerForm from "./PassengerForm";
import PaymentForm from "./PaymentForm";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getToken } from "@/lib/GetToken";

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
  const [error, setError] = useState<string>("");

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

  const handlePassengerFormSubmit = (
    data: PassengerData,
    seatNumber: number
  ) => {
    setPassengerData((prevState) => ({
      ...prevState,
      [seatNumber]: data,
    }));

    setPassengerFormValidity((prevState) => ({
      ...prevState,
      [seatNumber]: true,
    }));
  };

  const allFormsValid = selectedSeats.every(
    (seat) => passengerFormValidity[seat.number]
  );

  const isPaymentFormValid = (): boolean => {
    if (!paymentFormData) return false;
    const {
      names,
      surnames,
      identificationType,
      identificationNumber,
      gender,
      birthDate,
      email,
      mobilePhone,
      paymentMethod,
      amountGivenByCustomer,
    } = paymentFormData;

    return (
      !!names &&
      !!surnames &&
      !!identificationType &&
      !!identificationNumber &&
      !!gender &&
      !!birthDate &&
      !!email &&
      !!mobilePhone &&
      !!paymentMethod &&
      amountGivenByCustomer > 0
    );
  };

  const handlePayment = async (): Promise<void> => {
    try {
      const passengersList = Object.values(passengerData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/ticket-sale/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken}`,
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
        setError(responseData.data || "Error al crear la venta.");
      } else {
        window.location.reload();
      }
    } catch (error: any) {
      console.error("Error al procesar el pago:", error.message);
    }
  };

  const handleFormValidityChange = (isValid: boolean, seatNumber: number) => {
    setPassengerFormValidity((prevState) => ({
      ...prevState,
      [seatNumber]: isValid,
    }));
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
                  onSubmit={(data) =>
                    handlePassengerFormSubmit(data, seat.number)
                  }
                  onFormValidityChange={(isValid) =>
                    handleFormValidityChange(isValid, seat.number)
                  }
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
                  <Button
                    variant="travely"
                    disabled={!paymentFormData || !isPaymentFormValid()}
                  >
                    Finalizar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>¿Desea registrar esta venta?</DialogTitle>
                    {error && <p className="text-red-500">{error}</p>}
                  </DialogHeader>
                  <DialogFooter>
                    <div className="flex justify-between space-x-2">
                      <DialogClose asChild>
                        <Button type="button" variant="secondary">
                          Cancelar
                        </Button>
                      </DialogClose>
                      <DialogTrigger>
                        <Button
                          variant="confirm"
                          onClick={() => handlePayment()}
                          disabled={!paymentFormData || !isPaymentFormValid()}
                        >
                          Confirmar
                        </Button>
                      </DialogTrigger>
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
