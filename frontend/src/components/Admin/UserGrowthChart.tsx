import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const userData = [
  { month: "Jan", users: 1000 },
  { month: "Feb", users: 1500 },
  { month: "Mar", users: 2000 },
  { month: "Apr", users: 3000 },
  { month: "May", users: 3800 },
  { month: "Jun", users: 4500 },
];

const UserGrowthChart = () => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={userData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="users"
            stroke="#22c55e"
            fill="#bbf7d0"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
