"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";

function UserReport() {
  const [error, setError] = useState<Error | null>(null); // Estado para controlar el error

  const downloadPDF = async () => {
    try {
      // Obtener el valor del cookie y decodificarlo
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");

      // Convertir el valor del cookie a objeto JSON
      const cookieData: { data: { token?: string } } = JSON.parse(cookieValue);

      // Obtener el token del objeto JSON
      const token = cookieData.data.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      // Realizar la solicitud GET para descargar el PDF
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/get-all-report`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

      // Procesar la respuesta para descargar el archivo PDF
      const blob = await response.blob();
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "report.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
    } catch (error) {
      console.error("Error al descargar el PDF:", error);
      setError(error instanceof Error ? error : new Error(String(error))); // Actualizar el estado del error si ocurre un error
    }
  };

  const handleCloseErrorModal = () => {
    setError(null); // Establecer el error como nulo para cerrar el modal
  };

  return (
    <>
      <div className="justify-between flex items-center">
        <h2 className="text-xl font-bold text-gray-800">Reporte</h2>
        <Button variant={"destructive"} onClick={downloadPDF}>
          <span>Descargar PDF</span>
        </Button>
      </div>
    </>
  );
}

export default UserReport;
