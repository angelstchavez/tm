import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface PassengerFormProps {
  seatNumber: number;
}

const PassengerForm: React.FC<PassengerFormProps> = ({ seatNumber }) => {
  return (
    <div className="border rounded-lg p-4">
      <h2>Pasajero del asiento: {seatNumber}</h2>
      <div>
        <Label>Nombres</Label>
        <Input type="text" id="name" placeholder="Nombres"></Input>
      </div>
      <div>
        <Label>Apellidos</Label>
        <Input type="text" id="name" placeholder="Apellidos"></Input>
      </div>
      <div>
        <Label>Tipo de documento</Label>
        <select id="documentType" className="input">
          <option value="CC">Cédula de Ciudadanía</option>
          <option value="CE">Cédula de Extranjería</option>
          <option value="TI">Tarjeta de Identidad</option>
        </select>
      </div>
      <div>
        <Label>Número de documento</Label>
        <Input type="number" placeholder="Número de documento"></Input>
      </div>
      <Button variant={"outline"}>Registrar pasajero</Button>
    </div>
  );
};

export default PassengerForm;
