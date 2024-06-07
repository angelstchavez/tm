import React from "react";
import { Button } from "@/components/ui/button";

interface CustomButtonProps {
  onClick: () => void;
  disabled: boolean;
}

const SearchSeatsButton: React.FC<CustomButtonProps> = ({
  onClick,
  disabled,
}) => {
  return (
    <Button variant={"travely"} onClick={onClick} disabled={disabled}>
      Ver sillas
    </Button>
  );
};

export default SearchSeatsButton;
