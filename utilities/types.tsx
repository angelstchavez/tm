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
