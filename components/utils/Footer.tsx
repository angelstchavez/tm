const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-6 bg-gray-100 mt-auto">
      <div className="container mx-auto text-center">
        <span className="text-sm block md:inline-block my-2 text-gray-600">
          Travely Manager © {currentYear}. Todos los derechos reservados.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
