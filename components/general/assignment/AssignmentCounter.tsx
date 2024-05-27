import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import React from "react";

const AssignmentCounter = () => {
  return (
    <Section>
      <CustomTitle title={"Modulo de asignaciones"}></CustomTitle>
      <div className="flex flex-wrap justify-between">
        {/*Convierte eso en algo reutulisable, y que se le pase el icono y la entidad como atributo (react-icon)*/}
        <div className="w-full sm:w-1/4 text-center">Registro general</div>
        <div className="w-full sm:w-1/4 text-center">Registros del día</div>
        <div className="w-full sm:w-1/4 text-center">Registro de la semana</div>
        <div className="w-full sm:w-1/4 text-center">Registros del mes</div>
      </div>
    </Section>
  );
};

export default AssignmentCounter;
