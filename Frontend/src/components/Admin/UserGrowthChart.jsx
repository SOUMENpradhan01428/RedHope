import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, Bar, ComposedChart,
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

const UserGrowthChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>No user data available</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <ComposedChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="month" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis yAxisId="left" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <YAxis yAxisId="right" orientation="right" tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} hide />
          <Tooltip content={<CustomTooltip darkMode={darkMode} />} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Area yAxisId="left" name="Total Users" type="monotone" dataKey="users" stroke="#22c55e" strokeWidth={3} fill="url(#userGradient)" dot={{ r: 5, fill: "#22c55e", strokeWidth: 2, stroke: darkMode ? "#1e293b" : "#fff" }} activeDot={{ r: 7 }} />
          <Bar yAxisId="right" name="New Donors" dataKey="donors" fill="#60a5fa" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
          <Bar yAxisId="right" name="New Hospitals" dataKey="hospitals" fill="#a78bfa" radius={[4, 4, 0, 0]} barSize={20} opacity={0.8} />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGrowthChart;
