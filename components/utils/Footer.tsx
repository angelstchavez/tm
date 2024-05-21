const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-gray-100">
      <div className="container mx-auto text-center">
        <a
          href="/"
          className="text-2xl font-bold hover:underline block md:inline-block my-2 text-gray-600"
        >
          Travely Manager
        </a>{" "}
        <span className="text-xs block md:inline-block my-2 text-gray-600">
          © {currentYear}. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
