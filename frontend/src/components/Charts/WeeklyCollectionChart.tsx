import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Mon", collected: 10, requested: 8 },
  { day: "Tue", collected: 15, requested: 12 },
  { day: "Wed", collected: 14, requested: 9 },
  { day: "Thu", collected: 20, requested: 13 },
  { day: "Fri", collected: 25, requested: 19 },
  { day: "Sat", collected: 28, requested: 22 },
  { day: "Sun", collected: 12, requested: 9 },
];

const WeeklyCollectionChart: React.FC = () => (
  <ResponsiveContainer width="100%" height={250}>
    <BarChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="day" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="collected" fill="#22c55e" />
      <Bar dataKey="requested" fill="#ef4444" />
    </BarChart>
  </ResponsiveContainer>
);

export default WeeklyCollectionChart;
