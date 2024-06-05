import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Genders, DocumentTypes } from "@/utilities/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComboBox from "@/components/ui/combobox";
import ComboboxFetch from "@/components/api/ComboboxFetch";
import CustomTitle from "@/components/utils/CustomTitle";
import TotalSale from "./TotalSaleCount";

import Cookies from "js-cookie";

interface FormData {
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

interface FormProps {
  formData: FormData | null;
  setFormData: React.Dispatch<React.SetStateAction<FormData | null>>;
  handlePayment: (data: FormData) => void;
  tripId: number;
  totalCount: number;
}

const PaymentFormSchema: ZodType<FormData> = z.object({
  names: z.string().nonempty("Introduce un nombre válido."),
  surnames: z.string().nonempty("Introduce un apellido válido."),
  identificationType: z
    .string()
    .nonempty("Selecciona un tipo de documento válido."),
  identificationNumber: z
    .string()
    .nonempty("Introduce un número de documento válido.")
    .refine((value) => /^\d{5,10}$/.test(value), {
      message: "El número de documento debe tener entre 5 y 10 dígitos.",
    }),
  gender: z.string().nonempty("Selecciona un género válido."),
  birthDate: z
    .string()
    .nonempty("Introduce una fecha de nacimiento válida.")
    .refine(
      (value) => {
        const birthYear = new Date(value).getFullYear();
        const currentYear = new Date().getFullYear();
        return birthYear <= currentYear;
      },
      { message: "La fecha de nacimiento no puede ser en el futuro." }
    )
    .refine(
      (value) => {
        const birthDate = new Date(value);
        const eighteenYearsAgo = new Date();
        eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);
        return birthDate <= eighteenYearsAgo;
      },
      { message: "Debes ser mayor de edad para registrarte." }
    )
    .refine(
      (value) => {
        const birthDate = new Date(value);
        const oneHundredTwentyYearsAgo = new Date();
        oneHundredTwentyYearsAgo.setFullYear(
          oneHundredTwentyYearsAgo.getFullYear() - 120
        );
        return birthDate >= oneHundredTwentyYearsAgo;
      },
      { message: "La edad máxima permitida es de 120 años." }
    ),
  email: z.string().email("Introduce un correo electrónico válido."),
  paymentMethod: z.string().nonempty("Selecciona un método de pago válido."),
  amountGivenByCustomer: z
    .number()
    .min(0.01, "El monto debe ser mayor que cero."),
  mobilePhone: z
    .string()
    .nonempty("Introduce un número de teléfono válido.")
    .refine((value) => /^\d{10}$/.test(value), {
      message: "El número debe tener 10 dígitos.",
    }),
});

const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
  }).format(amount);
};

const PaymentForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  handlePayment,
  tripId,
  totalCount,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(PaymentFormSchema),
    mode: "onChange",
  });

  const [ticketPrice, setTicketPrice] = useState<number>(0);
  const [change, setChange] = useState<number>(0);
  const [isExactAmount, setIsExactAmount] = useState<boolean>(false);

  const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
  const cookieData = cookieValue ? JSON.parse(cookieValue) : null;
  const token = cookieData?.data?.token;

  useEffect(() => {
    const fetchTicketPrice = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/trip/get-by-id/${tripId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setTicketPrice(data.data.ticketPrice);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchTicketPrice();
  }, [tripId, token]);

  const calculateChange = (value: number) => {
    const totalToPay = totalCount * ticketPrice;
    const changeAmount = value - totalToPay;
    setChange(changeAmount > 0 ? changeAmount : 0);
  };

  const onAmountGivenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amountGiven = parseFloat(e.target.value);
    setValue("amountGivenByCustomer", amountGiven);
    calculateChange(amountGiven);
  };

  const onSubmit = (data: FormData) => {
    setFormData(data);
    handlePayment(data);
  };

  const watchedFormData = watch();

  useEffect(() => {
    setFormData(watchedFormData);
  }, [watchedFormData, setFormData]);

  return (
    <div className="flex flex-col md:flex-row md:space-x-2">
      <div className="md:w-1/2">
        <div className="border rounded-lg p-4 mb-2 bg-zinc-50">
          <CustomTitle title={"Datos del cliente"}></CustomTitle>
          <form
            autoComplete="off"
            className="space-y-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="mb-1">
              <Label>Nombres:</Label>
              <Input
                type="text"
                placeholder="Ej. Juan"
                {...register("names")}
              />
              {errors.names && (
                <span className="text-red-500 text-xs">
                  {errors.names.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Apellidos:</Label>
              <Input
                type="text"
                placeholder="Ej. Pineda"
                {...register("surnames")}
              />
              {errors.surnames && (
                <span className="text-red-500 text-xs">
                  {errors.surnames.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <ComboBox
                id="identificationType"
                options={DocumentTypes}
                register={register("identificationType")}
                label={"Tipo de documento:"}
              />
              {errors.identificationType && (
                <span className="text-red-500 text-xs">
                  {errors.identificationType.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Número de identificación:</Label>
              <Input
                type="text"
                placeholder="1234567890"
                {...register("identificationNumber")}
              />
              {errors.identificationNumber && (
                <span className="text-red-500 text-xs">
                  {errors.identificationNumber.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <ComboBox
                id="gender"
                options={Genders}
                register={register("gender")}
                label={"Género:"}
              />
              {errors.gender && (
                <span className="text-red-500 text-xs">
                  {errors.gender.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Fecha de nacimiento:</Label>
              <Input type="date" {...register("birthDate")} />
              {errors.birthDate && (
                <span className="text-red-500 text-xs">
                  {errors.birthDate.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Correo electrónico:</Label>
              <Input
                type="email"
                placeholder="ejemplo@correo.com"
                {...register("email")}
              />
              {errors.email && (
                <span className="text-red-500 text-xs">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Número de contacto:</Label>
              <Input
                type="number"
                placeholder="3001112233"
                {...register("mobilePhone")}
              />
              {errors.mobilePhone && (
                <span className="text-red-500 text-xs">
                  {errors.mobilePhone.message}
                </span>
              )}
            </div>
          </form>
        </div>
      </div>
      <div className="md:w-1/2 mt-2 md:mt-0">
        <TotalSale count={totalCount} tripId={tripId}></TotalSale>
        <div className="mb-2"></div>
        <div className="border rounded-lg p-4 bg-teal-500/10">
          <CustomTitle title={"Datos de pago"}></CustomTitle>
          <form className="space-y-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-1">
              <ComboboxFetch
                id="paymentMethod"
                endpoint="payment-method/get-all"
                label="Método de pago:"
                register={register("paymentMethod")}
                error={errors.paymentMethod?.message}
              />
            </div>
            <div className="mb-1">
              <Label>Monto pagado por el cliente:</Label>
              <Input
                type="number"
                placeholder="0"
                {...register("amountGivenByCustomer", {
                  valueAsNumber: true,
                  onChange: onAmountGivenChange,
                })}
                disabled={isExactAmount}
              />
              {errors.amountGivenByCustomer && (
                <span className="text-red-500 text-xs">
                  {errors.amountGivenByCustomer.message}
                </span>
              )}
            </div>
            <div className="mb-1">
              <Label>Vueltos:</Label>
              <Input
                type="text"
                placeholder="0"
                value={
                  isExactAmount ? formatCurrency(0) : formatCurrency(change)
                }
                className="font-bold bg-teal-500/30 text-teal-900"
                readOnly
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
