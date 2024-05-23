import React from "react";
import {
  AiOutlineBulb,
  AiOutlineSafetyCertificate,
  AiOutlineCar,
  AiOutlineClockCircle,
  AiOutlineWallet,
  AiOutlineTeam,
} from "react-icons/ai";

interface BenefitProps {
  icon: JSX.Element;
  title: string;
  description: string;
}

const BenefitItem: React.FC<BenefitProps> = ({ icon, title, description }) => {
  return (
    <div className="border p-4 rounded-lg shadow-lg">
      <div className="bg-travely-100/10 text-travely-100 flex justify-center items-center mb-4 w-10 h-10 rounded-full bg-primary-100 lg:h-12 lg:w-12 dark:bg-primary-900">
        {icon}
      </div>
      <h3 className="mb-1 text-xl font-bold ">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );
};

const Hero: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl sm:py-16 lg:px-6">
        <div className="max-w-screen-md mb-8 lg:mb-16">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900 dark:text-white">
            ¡Viaja con{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r to-travely-200 from-sky-400">
              confianza
            </span>{" "}
            por toda Colombia!
          </h2>
          <p className="text-gray-500 sm:text-xl dark:text-gray-400">
            Nuestro sistema facilita la gestión eficiente de viajes terrestres,
            ofreciendo una serie de beneficios clave para tu empresa.
          </p>
        </div>
        <div className="space-y-8 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-12 md:space-y-0">
          <BenefitItem
            icon={
              <AiOutlineBulb className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Planificación Eficiente"
            description="Organiza y planifica tus rutas de viaje de manera eficiente, optimizando tiempos y recursos."
          />
          <BenefitItem
            icon={
              <AiOutlineSafetyCertificate className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Seguridad Garantizada"
            description="Mantén la seguridad en cada viaje con protocolos rigurosos y certificaciones de calidad."
          />
          <BenefitItem
            icon={
              <AiOutlineCar className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Flota Moderna"
            description="Disfruta de viajes cómodos y seguros en nuestra flota de vehículos modernos y bien mantenidos."
          />
          <BenefitItem
            icon={
              <AiOutlineClockCircle className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Gestión de Tiempos"
            description="Optimiza tus horarios y llega a tiempo a cada destino con nuestra eficiente gestión de tiempos."
          />
          <BenefitItem
            icon={
              <AiOutlineWallet className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Control de Costos"
            description="Mantén tus gastos bajo control y optimiza tu presupuesto con nuestro sistema de control de costos integrado."
          />
          <BenefitItem
            icon={
              <AiOutlineTeam className="w-5 h-5 text-primary-600 lg:w-6 lg:h-6 dark:text-primary-300" />
            }
            title="Colaboración Eficiente"
            description="Fomenta la colaboración entre equipos y maximiza la eficiencia en la gestión de viajes con nuestro sistema integrado."
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
