"use client";

import React, { useEffect, useState } from "react";
import Section from "@/components/ui/Section";
import CustomTitle from "@/components/utils/CustomTitle";
import CounterCard from "./CounterCard";
import {
  FaRegClipboard,
  FaCalendarDay,
  FaCalendarWeek,
  FaCalendarAlt,
} from "react-icons/fa";
import Cookies from "js-cookie";

interface CounterData {
  totalRecords: number;
  totalRecordsToday: number;
  totalRecordsThisWeek: number;
  totalRecordsThisMonth: number;
}

interface CounterModuleProps {
  entityName: string;
  module: string;
  entities: string;
}

const CounterModule: React.FC<CounterModuleProps> = ({
  entityName,
  module,
  entities,
}) => {
  const [data, setData] = useState<CounterData>({
    totalRecords: 0,
    totalRecordsToday: 0,
    totalRecordsThisWeek: 0,
    totalRecordsThisMonth: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cookieValue = decodeURIComponent(Cookies.get("authTokens") || "");
        const cookieData: { data: { token?: string } } =
          JSON.parse(cookieValue);
        const token = cookieData.data.token;

        if (!token) {
          throw new Error("No se encontró el token en el cookie.");
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/${entityName}/get-counter`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error("Error al obtener los contadores.");
        }

        const responseData = await response.json();

        if (!responseData.success || !responseData.data) {
          throw new Error("La respuesta no contiene datos válidos.");
        }

        setData(responseData.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [entityName]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Section>
      <CustomTitle title={`Modulo de ${module}`} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CounterCard
          icon={FaRegClipboard}
          title="General"
          count={data.totalRecords}
          entities={entities}
        />
        <CounterCard
          icon={FaCalendarDay}
          title="Hoy"
          count={data.totalRecordsToday}
          entities={entities}
        />
        <CounterCard
          icon={FaCalendarWeek}
          title="Esta semana"
          count={data.totalRecordsThisWeek}
          entities={entities}
        />
        <CounterCard
          icon={FaCalendarAlt}
          title="Este mes"
          count={data.totalRecordsThisMonth}
          entities={entities}
        />
      </div>
    </Section>
  );
};

export default CounterModule;
