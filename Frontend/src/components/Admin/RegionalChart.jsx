import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const RegionalChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  const gridColor = darkMode ? "#334155" : "#e2e8f0";
  const textColor = darkMode ? "#94a3b8" : "#64748b";

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>No regional data</p>
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 280 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <defs>
            <linearGradient id="regionBar1" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0.5} />
            </linearGradient>
            <linearGradient id="regionBar2" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity={0.5} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis dataKey="region" tick={{ fill: textColor, fontSize: 12 }} axisLine={{ stroke: gridColor }} tickLine={false} />
          <YAxis tick={{ fill: textColor, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              return (
                <div className={`px-4 py-3 rounded-lg shadow-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
                  <p className="font-semibold mb-1">{label} Region</p>
                  {payload.map((p, i) => (
                    <p key={i} style={{ color: p.fill || p.color }} className="flex justify-between gap-4">
                      <span>{p.name}:</span>
                      <span className="font-bold">{p.value}</span>
                    </p>
                  ))}
                </div>
              );
            }}
          />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
          <Bar name="Users" dataKey="count" fill="url(#regionBar1)" radius={[6, 6, 0, 0]} maxBarSize={50} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RegionalChart;
