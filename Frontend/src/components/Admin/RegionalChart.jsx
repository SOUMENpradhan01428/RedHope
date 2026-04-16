import React from "react";
import {
  AreaChart,
  Area,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";

const regionData = [
  { region: "North", count: 800 },
  { region: "South", count: 950 },
  { region: "East", count: 650 },
  { region: "West", count: 700 },
];

const RegionalChart = () => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <AreaChart data={regionData}>
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#9333ea"
            fill="#e9d5ff"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalChart;
