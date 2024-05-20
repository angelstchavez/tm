import React from "react";
import { IconType } from "react-icons";

interface CustomIconProps {
  icon: IconType;
  text: string;
}

const CustomTitleIcon: React.FC<CustomIconProps> = ({ icon: Icon, text }) => {
  return (
    <div className="p-1 px-2 font-semibold text-zinc-500 bg-zinc-300 rounded-md border inline-flex items-center">
      <Icon className="mr-2 h-5 w-5" />
      <h2 className="text-lg font-semibold">{text}</h2>
    </div>
  );
};

export default CustomTitleIcon;
