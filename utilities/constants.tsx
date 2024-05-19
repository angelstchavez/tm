import { FaHome, FaPowerOff } from "react-icons/fa";
import { MdFolder } from "react-icons/md";

import { SideNavItem } from "./types";

export const SIDENAV_ITEMS: SideNavItem[] = [
  {
    title: "Inicio",
    path: "/admin",
    icon: <FaHome size={24} />,
  },
  {
    title: "Procesos",
    path: "/processes",
    icon: <MdFolder size={24} />,
    submenu: true,
    subMenuItems: [
      { title: "Registrar venta", path: "/admin/processes/register-sale" },
      {
        title: "Consultar histórico",
        path: "/admin/processes/register-reservation",
      },
    ],
  },
  {
    title: "Registros",
    path: "/registers",
    icon: <MdFolder size={24} />,
    submenu: true,
    subMenuItems: [
      { title: "Viajes", path: "/admin/registers/trips" },
      { title: "Rutas de viaje", path: "/admin/registers/routes" },
      { title: "Clientes", path: "/admin/registers/customers" },
      { title: "Vehiculos", path: "/admin/registers/vehicles" },
      { title: "Terminales", path: "/admin/registers/transport-terminals" },
    ],
  },
  {
    title: "Administrador",
    path: "/administrator",
    icon: <MdFolder size={24} />,
    submenu: true,
    subMenuItems: [
      { title: "Asignaciones", path: "/admin/administrator/assignments" },
      { title: "Empleados", path: "/admin/administrator/employees" },
      { title: "Usuarios", path: "/admin/administrator/users" },
    ],
  },
  {
    title: "Cerrar sesión",
    path: "/logout",
    icon: <FaPowerOff size={24} />,
  },
];
