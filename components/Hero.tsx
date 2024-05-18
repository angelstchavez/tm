import Image from "next/image";
import React from "react";

const Hero: React.FC = () => {
  return (
    <div className="h-full py-28 text-white bg-travely-400">
      <div className="space-y-5 max-w-4xl mx-auto text-center">
        <h1 className="text-4xl text-white font-extrabold mx-auto sm:text-6xl">
          Viaja con confianza por toda Colombia.
        </h1>
        <p className="max-w-xl mx-auto">
          Nuestro sistema facilita la gestión eficiente de viajes terrestres.
        </p>
        <div className="relative w-full max-w-4xl mx-auto">
          <Image
            src={"/images/bus.png"}
            alt={"Autobús viajando"}
            layout="responsive"
            width={600}
            height={600}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
