import { ReactNode } from "react";

interface MarginWidthWrapperProps {
  children: ReactNode;
}

const MarginWidthWrapper: React.FC<MarginWidthWrapperProps> = ({
  children,
}) => {
  return (
    <div className="flex flex-col md:ml-60 sm:border-r min-h-screen">
      {children}
    </div>
  );
};

export default MarginWidthWrapper;
