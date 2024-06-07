import React from "react";
import { FaSpinner } from "react-icons/fa";

const Loading: React.FC = () => {
  return (
    <output className="flex justify-center items-center">
      <FaSpinner className="m-2 w-8 h-8 text-gray-200 animate-spin fill-travely-300" />
    </output>
  );
};

export default Loading;
