"use client";

import { LazyLoadImage } from "react-lazy-load-image-component";

const NotFoundPage: React.FC = () => {
  return (
    <section className="bg-white dark:bg-gray-900 h-screen flex justify-center items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <div className="flex justify-center">
            <LazyLoadImage
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/404/404-computer.svg"
              alt="404"
              width={400}
              height={400}
            />
          </div>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">
            ¡Vaya! Esta página no existe.
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Lo siento, no podemos encontrar esa página.<br></br>Puedes explorar
            mucho en la página de inicio.
          </p>
          <a
            href="/"
            className="inline-flex text-white bg-travely-200 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Volver a la página de inicio
          </a>
        </div>
      </div>
    </section>
  );
};

export default NotFoundPage;
