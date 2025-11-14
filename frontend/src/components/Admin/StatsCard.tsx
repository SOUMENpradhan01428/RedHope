import React from "react";

interface StatsCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon,
}) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex justify-between">
        <p className="text-gray-600 font-medium">{title}</p>
        {icon && <span className="text-xl">{icon}</span>}
      </div>
      <p className="text-2xl font-bold mt-2">{value}</p>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
