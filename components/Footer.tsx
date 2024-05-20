const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="p-2 md:p-4 lg:p-6 bg-travely-500">
      <div className="mx-auto max-w-screen-xl text-center">
        <a
          href="#"
          className="flex justify-center items-center text-lg font-bold text-white"
        >
          Travely Manager
        </a>
        <p className="my-2 text-zinc-200">
          Plataforma de Gestión de Ventas de Tickets: Simplifica la
          Administración y Venta de Boletos
        </p>

        <span className="text-xs text-zinc-100 sm:text-center">
          © {currentYear}{" "}
          <a href="#" className="hover:underline">
            Travely Manager™
          </a>
          . Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
