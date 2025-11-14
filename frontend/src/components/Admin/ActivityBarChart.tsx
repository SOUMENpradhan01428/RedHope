import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const activity = [
  { hour: "8 AM", requests: 40 },
  { hour: "10 AM", requests: 55 },
  { hour: "12 PM", requests: 70 },
  { hour: "2 PM", requests: 80 },
  { hour: "4 PM", requests: 60 },
];

const ActivityBarChart = () => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <BarChart data={activity}>
          <XAxis dataKey="hour" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="requests" radius={[4, 4, 0, 0]} fill="#06b6d4" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityBarChart;
