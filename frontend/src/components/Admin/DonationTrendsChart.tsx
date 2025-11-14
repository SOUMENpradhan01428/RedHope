import React from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", donations: 300 },
  { month: "Feb", donations: 450 },
  { month: "Mar", donations: 600 },
  { month: "Apr", donations: 550 },
  { month: "May", donations: 800 },
  { month: "Jun", donations: 950 },
];

const DonationTrendsChart = () => {
  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            dataKey="donations"
            type="monotone"
            stroke="#3b82f6"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationTrendsChart;
