import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "O+", value: 156 },
  { name: "A+", value: 45 },
  { name: "A-", value: 12 },
  { name: "B+", value: 78 },
  { name: "B-", value: 8 },
  { name: "AB+", value: 25 },
  { name: "AB-", value: 3 },
  { name: "O-", value: 18 },
];

const COLORS = [
  "#f87171",
  "#fb7185",
  "#facc15",
  "#34d399",
  "#60a5fa",
  "#a78bfa",
  "#fbbf24",
  "#fb923c",
];

const BloodTypePieChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={250}>
    <PieChart>
      <Pie
        data={data}
        cx="50%"
        cy="50%"
        labelLine={false}
        label={({ name }) => name}
        outerRadius={90}
        fill="#8884d8"
        dataKey="value"
      >
        {data.map((_, index) => (
          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
        ))}
      </Pie>
      <Tooltip />
    </PieChart>
  </ResponsiveContainer>
);

export default BloodTypePieChart;
