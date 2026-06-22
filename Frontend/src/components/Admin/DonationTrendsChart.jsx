import React from "react";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Legend, Area, ComposedChart,
} from "recharts";
import { useTheme } from "../../context/ThemeContext";

const CustomTooltip = ({ active, payload, label, darkMode }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className={`px-4 py-3 rounded-lg shadow-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}:</span>
          <span className="font-bold">{p.value}</span>
        </p>
      ))}
    </div>
  );
};

const DonationTrendsChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>No donation data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="donationGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="requestGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area type="monotone" dataKey="donations" fill="url(#donationGradient)" stroke="none" />
          <Area type="monotone" dataKey="requests" fill="url(#requestGradient)" stroke="none" />
          <Line name="Donations" dataKey="donations" type="monotone" stroke="#3b82f6" strokeWidth={3} dot={{ r: 5, fill: "#3b82f6", strokeWidth: 2, stroke: darkMode ? "#1e293b" : "#fff" }} activeDot={{ r: 7 }} />
          <Line name="Requests" dataKey="requests" type="monotone" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 4, fill: "#f43f5e", strokeWidth: 2, stroke: darkMode ? "#1e293b" : "#fff" }} activeDot={{ r: 6 }} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationTrendsChart;
