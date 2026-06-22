import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const ActivityBarChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>No activity data</p>
      </div>
    );
  }

  const maxVal = Math.max(...data.map((d) => d.requests));

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="barHigh" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="barMed" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="barLow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="hour" tick={{ fill: textColor, fontSize: 11 }} axisLine={{ stroke: gridColor }} tickLine={false} interval={0} angle={-30} textAnchor="end" height={50} />
          <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className={`px-4 py-3 rounded-lg shadow-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
                  <p className="font-semibold">{label}</p>
                  <p className="text-blue-500">{payload[0].value} requests</p>
                </div>
              );
            }}
          />
          <Bar dataKey="requests" radius={[6, 6, 0, 0]} maxBarSize={40}>
            {data.map((entry, i) => {
              const ratio = maxVal > 0 ? entry.requests / maxVal : 0;
              const fill = ratio > 0.7 ? "url(#barHigh)" : ratio > 0.4 ? "url(#barMed)" : "url(#barLow)";
              return <Cell key={i} fill={fill} />;
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityBarChart;
