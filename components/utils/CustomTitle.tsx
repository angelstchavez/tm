import React from "react";

interface CustomTitleProps {
  title: string;
}

const CustomTitle: React.FC<CustomTitleProps> = ({ title }) => {
  return <h2 className="text-xl font-bold text-gray-800">{title}</h2>;
};

export default CustomTitle;
