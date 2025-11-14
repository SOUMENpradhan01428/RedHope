import React from "react";

interface ItemProps {
  title: string;
  value: string;
  status: "Operational" | "Warning" | "Critical";
}

const HealthStatusCard: React.FC<ItemProps> = ({ title, value, status }) => {
  const statusClass = {
    Operational: "bg-green-100 text-green-600",
    Warning: "bg-yellow-100 text-yellow-600",
    Critical: "bg-red-100 text-red-600",
  }[status];

  return (
    <div className="border p-4 rounded-lg bg-gray-50">
      <p className="text-gray-700 font-semibold">{title}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      <span
        className={`text-xs px-2 py-1 rounded-full inline-block mt-2 ${statusClass}`}
      >
        {status}
      </span>
    </div>
  );
};

export default HealthStatusCard;
