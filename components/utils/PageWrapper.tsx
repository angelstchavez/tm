import { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className="flex flex-col pt-2 px-4 space-y-2 bg-zinc-100 flex-grow pb-4">
      {children}
    </div>
  );
};

export default PageWrapper;
