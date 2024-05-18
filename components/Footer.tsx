import React from "react";

const Footer = () => {
  return (
    <footer className="bg-travely-500">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <a
            href="https://flowbite.com/"
            className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
          >
            <span className="self-center text-2xl font-bold whitespace-nowrap text-white">
              Travely Manager
            </span>
          </a>
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-white">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Acerca de
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Política de Privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                Licencia
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline">
                Contacto
              </a>
            </li>
          </ul>
        </div>
        <span className="block text-sm text-white sm:text-center">
          Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
