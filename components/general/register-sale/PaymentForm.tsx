import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z, ZodType } from "zod";
import { Genders, DocumentTypes } from "@/utilities/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import ComboBox from "@/components/ui/combobox";
import ComboboxFetch from "@/components/api/ComboboxFetch";
import CustomTitle from "@/components/utils/CustomTitle";

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
}

const PaymentFormSchema: ZodType<FormData> = z.object({
  names: z.string().nonempty("Introduce un nombre válido."),
  surnames: z.string().nonempty("Introduce un apellido válido."),
  identificationType: z.string().nonempty("Selecciona un tipo de documento válido."),
  identificationNumber: z
    .string()
    .nonempty("Introduce un número de documento válido."),
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

const PaymentForm: React.FC<FormProps> = ({
  formData,
  setFormData,
  handlePayment,
}) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(PaymentFormSchema),
    mode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    setFormData(data);
    handlePayment(data);
  };

  const watchedFormData = watch();

  useEffect(() => {
    setFormData(watchedFormData);
  }, [watchedFormData, setFormData]);

  return (
    <>
      <div className="border rounded-lg p-4">
        <CustomTitle title={"Datos del cliente"}></CustomTitle>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="mb-2">
            <Label>Nombres:</Label>
            <Input type="text" placeholder="Ej. Juan" {...register("names")} />
            {errors.names && (
              <span className="text-red-500 text-xs">
                {errors.names.message}
              </span>
            )}
          </div>
          <div className="mb-2">
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
          <div className="mb-2">
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
          <div className="mb-2">
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
          <div className="mb-2">
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
          <div className="mb-2">
            <Label>Fecha de nacimiento:</Label>
            <Input
              type="date"
              placeholder="Ej. Pineda"
              {...register("birthDate")}
            />
            {errors.birthDate && (
              <span className="text-red-500 text-xs">
                {errors.birthDate.message}
              </span>
            )}
          </div>
          <div className="mb-2">
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
          <div className="mb-2">
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
      <div className="mt-2 border rounded-lg p-4">
        <CustomTitle title={"Datos de pago"}></CustomTitle>
        <form
          className="grid grid-cols-1 sm:grid-cols-2 gap-x-4"
          onSubmit={handleSubmit(onSubmit)}
        >
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
              {...register("amountGivenByCustomer", { valueAsNumber: true })}
            />
            {errors.amountGivenByCustomer && (
              <span className="text-red-500 text-xs">
                {errors.amountGivenByCustomer.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default PaymentForm;
