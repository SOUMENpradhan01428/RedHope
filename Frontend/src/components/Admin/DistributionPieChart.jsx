import React, { useState } from "react";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Sector } from "recharts";
import { useTheme } from "../../context/ThemeContext";

const COLORS = ["#ef4444", "#3b82f6", "#22c55e", "#a855f7", "#f97316", "#06b6d4", "#eab308", "#ec4899"];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  return (
    <g>
      <text x={cx} y={cy - 8} textAnchor="middle" fill={fill} className="text-base font-bold">
        {payload.type}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#94a3b8" className="text-xs">
        {value} units ({(percent * 100).toFixed(0)}%)
      </text>
      <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8} startAngle={startAngle} endAngle={endAngle} fill={fill} />
      <Sector cx={cx} cy={cy} innerRadius={outerRadius + 12} outerRadius={outerRadius + 16} startAngle={startAngle} endAngle={endAngle} fill={fill} opacity={0.4} />
    </g>
  );
};

const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, type, percent }) => {
  if (percent < 0.05) return null;
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 22;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} fill="#94a3b8" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" className="text-xs font-medium">
      {type}
    </text>
  );
};

const DistributionPieChart = ({ data = [] }) => {
  const { darkMode } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);

  if (data.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p className={`text-sm ${darkMode ? "text-slate-500" : "text-gray-400"}`}>No distribution data</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center" style={{ height: 320 }}>
      <div style={{ width: "100%", height: 240 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              activeIndex={activeIndex}
              activeShape={renderActiveShape}
              data={data}
              dataKey="value"
              nameKey="type"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              label={renderLabel}
              onMouseEnter={(_, index) => setActiveIndex(index)}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} stroke="none" />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0];
                return (
                  <div className={`px-3 py-2 rounded-lg shadow-lg border text-sm ${darkMode ? "bg-slate-800 border-slate-600 text-white" : "bg-white border-gray-200 text-gray-800"}`}>
                    <span className="font-semibold" style={{ color: d.payload.fill }}>{d.name}</span>: {d.value} units
                  </div>
                );
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-1.5 cursor-pointer" onClick={() => setActiveIndex(i)}>
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            <span className={`text-xs ${activeIndex === i ? "font-bold" : ""} ${darkMode ? "text-slate-300" : "text-gray-600"}`}>
              {d.type}: {d.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionPieChart;
