import React from "react";
import { IconType } from "react-icons";

interface CounterCardProps {
  title: string;
  count: number;
  entities: string;
  icon: IconType;
}

const CounterCard: React.FC<CounterCardProps> = ({
  title,
  count,
  entities,
  icon: Icon,
}) => {
  return (
    <div className="rounded-lg border text-card-foregroun p-2 bg-travely-100/5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-medium text-md">{title}</h3>
        <div className="bg-travely-100/20 p-2 rounded-md">
          <Icon className="h-4 w-4 text-travely-100" />
        </div>
      </div>
      <div>
        <div className="text-xl font-bold text-travely-200">{count}</div>
        <p className="text-xs text-muted-foreground">{entities}</p>
      </div>
    </div>
  );
};

export default CounterCard;
