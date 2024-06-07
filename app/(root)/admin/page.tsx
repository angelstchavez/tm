"use client";

import React, { useEffect, useMemo, useState } from "react";
import Section from "@/components/ui/Section";

const AdminPage = () => {
  
  const [time, setTime] = useState<Date>(new Date());

  useEffect(() => {
    const tiempo = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(tiempo);
  }, []);

  const formatTime = (date: Date) => date.toLocaleTimeString("es-CO");

  const formattedDate = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("es-CO", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <Section>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold lg:text-7xl">
          {formatTime(time)}
        </h1>
        <p>{formattedDate}.</p>
      </div>
    </Section>
  );
};

export default AdminPage;
