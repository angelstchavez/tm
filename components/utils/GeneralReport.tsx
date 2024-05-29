"use client";

import React, { useState } from "react";
import Cookies from "js-cookie";
import { Button } from "@/components/ui/button";
import Section from "../ui/Section";

interface GeneralReportProps {
  entity: string;
}

const GeneralReport: React.FC<GeneralReportProps> = ({ entity }) => {
  const [error, setError] = useState<Error | null>(null);

  const downloadPDF = async () => {
    try {
      const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");

      const cookieData: { data: { token?: string } } = JSON.parse(cookieValue);

      const token = cookieData.data.token;

      if (!token) {
        throw new Error("No se encontró el token en el cookie.");
      }

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entity}/get-all-report`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            accept: "*/*",
          },
        }
      );

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
      setError(error instanceof Error ? error : new Error(String(error)));
    }
  };

  const handleCloseErrorModal = () => {
    setError(null);
  };

  return (
    <Button variant={"default"} onClick={downloadPDF}>
      <span>Descargar PDF</span>
    </Button>
  );
};

export default GeneralReport;
