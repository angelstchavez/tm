import React from "react";
import Section from "@/components/ui/Section";

const AdminPage = () => {
  const now = new Date();
  const time = now.toLocaleTimeString("es-CO", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
  const date = now.toLocaleDateString("es-CO", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  return (
    <Section>
      <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11 px-5 py-8"></div>
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
        <p>{date}.</p>
      </div>
    </Section>
  );
};

export default AdminPage;
