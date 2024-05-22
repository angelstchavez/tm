import React, { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ children }) => (
  <section className="mt-2 h-auto w-full rounded-md bg-white shadow-md border p-4 flex flex-col">
    {children}
  </section>
);

export default Section;
