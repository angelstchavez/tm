import Image from "next/image";
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="h-full py-28">
      <div className="space-y-5 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl text-zinc-800 font-extrabold sm:text-6xl">
          Viaja con confianza por toda Colombia.
        </h1>
        <p className="max-w-xl mx-auto">
          Nuestro sistema facilita la gestión eficiente de viajes terrestres.
        </p>
      </div>
    </div>
  );
};

export default Hero;
