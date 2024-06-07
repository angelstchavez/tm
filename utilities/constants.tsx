import { FaHome, FaPowerOff } from "react-icons/fa";
import { MdFolder } from "react-icons/md";
import { SideNavItem } from "./types";
import { IoPerson } from "react-icons/io5";

const generateSideNavItem = (
  title: string,
  path: string,
  icon: JSX.Element,
  submenu?: boolean,
  subMenuItems?: { title: string; path: string }[],
  allowedRoles?: string[]
): SideNavItem => {
  return {
    title,
    path,
    icon,
    submenu,
    subMenuItems,
    allowedRoles,
  };
};

export const SIDENAV_ITEMS: SideNavItem[] = [
  generateSideNavItem(
    "Inicio",
    "/admin",
    <FaHome size={24} />,
    undefined,
    undefined,
    ["Administrador", "Vendedor", "Conductor"]
  ),
  generateSideNavItem(
    "Procesos",
    "/processes",
    <MdFolder size={24} />,
    true,
    [
      { title: "Registrar venta", path: "/admin/processes/register-sale" },
      {
        title: "Consultar histórico",
        path: "/admin/processes/search-historic",
      },
    ],
    ["Administrador", "Vendedor"]
  ),
  generateSideNavItem(
    "Registros",
    "/registers",
    <MdFolder size={24} />,
    true,
    [
      { title: "Viajes", path: "/admin/registers/trips" },
      { title: "Rutas de viaje", path: "/admin/registers/routes" },
      { title: "Clientes", path: "/admin/registers/customers" },
      { title: "Vehiculos", path: "/admin/registers/vehicles" },
      { title: "Terminales", path: "/admin/registers/transport-terminals" },
    ],
    ["Administrador"]
  ),
  generateSideNavItem(
    "Administrador",
    "/administrator",
    <MdFolder size={24} />,
    true,
    [
      { title: "Asignaciones", path: "/admin/administrator/assignments" },
      { title: "Empleados", path: "/admin/administrator/employees" },
      { title: "Usuarios", path: "/admin/administrator/users" },
      { title: "Reportes", path: "/admin/administrator/reports" },
    ],
    ["Administrador"]
  ),
  // More items...
  generateSideNavItem(
    "Conductor",
    "/driver",
    <MdFolder size={24} />,
    true,
    [{ title: "Asignaciones", path: "/admin/driver/assignments" }],
    ["Conductor"]
  ),
  // More items...
  generateSideNavItem(
    "Mi perfil",
    "/admin/profile",
    <IoPerson size={24} />,
    undefined,
    undefined,
    ["Administrador", "Vendedor", "Conductor"]
  ),
  generateSideNavItem("Cerrar sesión", "/logout", <FaPowerOff size={24} />),
];
