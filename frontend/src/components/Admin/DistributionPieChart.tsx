import React from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";

const data = [
  { type: "A", value: 25 },
  { type: "B", value: 30 },
  { type: "AB", value: 10 },
  { type: "O", value: 35 },
];

const colors = ["#f43f5e", "#3b82f6", "#22c55e", "#a855f7"];

const DistributionPieChart = () => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="type" outerRadius={90}>
            {data.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DistributionPieChart;
