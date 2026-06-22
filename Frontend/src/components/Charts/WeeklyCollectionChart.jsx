import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const WeeklyCollectionChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#334155" : "#e2e8f0"} vertical={false} />
        <XAxis dataKey="day" stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 12}} axisLine={false} tickLine={false} />
        <YAxis stroke={darkMode ? "#94a3b8" : "#64748b"} tick={{fill: darkMode ? '#cbd5e1' : '#475569', fontSize: 12}} axisLine={false} tickLine={false} />
        <Tooltip 
          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#f8fafc' : '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          itemStyle={{ color: darkMode ? '#e2e8f0' : '#334155' }}
          cursor={{fill: darkMode ? '#334155' : '#f1f5f9'}}
        />
        <Bar dataKey="collected" name="Collected (Units)" fill="#10b981" radius={[4, 4, 0, 0]} maxBarSize={40} />
        <Bar dataKey="requested" name="Requested (Units)" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={40} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default WeeklyCollectionChart;
