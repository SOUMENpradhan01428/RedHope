import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#ef4444", "#f43f5e", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f97316"];

const BloodTypePieChart = ({ data = [] }) => {
  const { darkMode } = useTheme();

  if (!data || data.length === 0) {
    return <div className="h-[250px] flex items-center justify-center text-gray-400 font-medium">No stock data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={85}
          paddingAngle={4}
          dataKey="value"
          stroke={darkMode ? "#0f172a" : "#ffffff"}
          strokeWidth={3}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip 
          contentStyle={{ backgroundColor: darkMode ? '#1e293b' : '#ffffff', borderColor: darkMode ? '#334155' : '#e2e8f0', color: darkMode ? '#f8fafc' : '#0f172a', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', border: 'none' }}
          itemStyle={{ color: darkMode ? '#e2e8f0' : '#334155', fontWeight: 600 }}
          formatter={(value, name) => [`${value} Units`, name]}
        />
        <Legend 
          verticalAlign="bottom" 
          height={36} 
          iconType="circle"
          wrapperStyle={{ color: darkMode ? '#cbd5e1' : '#475569', fontSize: '12px', paddingTop: '20px' }} 
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default BloodTypePieChart;
