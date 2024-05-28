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
    <div className="rounded-xl border bg-card text-card-foreground shadow">
      <div className="p-3 flex flex-row items-center justify-between space-y-0 pb-2">
        <h3 className="tracking-tight text-sm font-medium">{title}</h3>
        <div className="bg-travely-100/20 p-2 rounded-lg">
          <Icon className="h-4 w-4 text-muted-foreground text-travely-100" />
        </div>
      </div>
      <div className="p-3 pt-0">
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{entities}</p>
      </div>
    </div>
  );
};

export default CounterCard;
