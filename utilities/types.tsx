export type SideNavItem = {
  allowedRoles?: string[];
  title: string;
  path: string;
  icon?: JSX.Element;
  submenu?: boolean;
  subMenuItems?: SideNavItem[];
};

export const DocumentTypes = [
  { value: "Cédula de Ciudadanía", label: "Cédula de Ciudadanía" },
  { value: "Cédula de Extranjería", label: "Cédula de Extranjería" },
  { value: "Tarjeta de identidad", label: "Tarjeta de identidad" },
];

export const TransmissionTypes = [
  { value: "Manual", label: "Manual" },
  { value: "Automático", label: "Automático" },
  { value: "Semi-automático", label: "Semi-automático" },
];

export const FuelTypes = [
  { value: "Gasolina", label: "Gasolina" },
  { value: "Diésel", label: "Diésel" },
  { value: "Eléctrico", label: "Eléctrico" },
  { value: "Híbrido", label: "Híbrido" },
];

export const ModelTypes = [
  { value: "Autobús", label: "Autobús" },
  { value: "Automóvil", label: "Automóvil" },
  { value: "Camioneta", label: "Camioneta" },
  { value: "Camión", label: "Camión" },
  { value: "Furgoneta", label: "Furgoneta" },
];

export const Colors = [
  { value: "Rojo", label: "Rojo" },
  { value: "Azul", label: "Azul" },
  { value: "Verde", label: "Verde" },
  { value: "Amarillo", label: "Amarillo" },
  { value: "Naranja", label: "Naranja" },
  { value: "Morado", label: "Morado" },
  { value: "Rosa", label: "Rosa" },
  { value: "Gris", label: "Gris" },
  { value: "Blanco", label: "Blanco" },
  { value: "Negro", label: "Negro" },
];

export const Genders = [
  { value: "Masculino", label: "Masculino" },
  { value: "Femenino", label: "Femenino" },
];

export const EmployeeRoles = [
  { value: "Conductor", label: "Conductor" },
  { value: "Vendedor", label: "Vendedor" },
];

export const SystemRoles = [
  { value: "Administrador", label: "Administrador" },
  { value: "Conductor", label: "Conductor" },
  { value: "Vendedor", label: "Vendedor" },
];
