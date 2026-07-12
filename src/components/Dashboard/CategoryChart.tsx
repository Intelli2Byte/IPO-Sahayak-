'use client';

import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { mockDashboardStats } from '@/data/mockData';

export default function CategoryChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-72 w-full bg-slate-50 animate-pulse rounded-2xl flex items-center justify-center text-slate-400 font-medium text-sm">
        Loading analytics charts...
      </div>
    );
  }

  // Pre-process colors to match theme
  const data = mockDashboardStats.progressByCategory.map((item) => {
    let fill = '#3b82f6'; // default primary light
    if (item.color === 'emerald') fill = '#10b981';
    else if (item.color === 'amber') fill = '#f59e0b';
    else if (item.color === 'red') fill = '#ef4444';

    return {
      ...item,
      fill
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl border border-slate-800 text-xs font-semibold">
          <p className="font-bold text-sm mb-1">{data.category}</p>
          <div className="flex items-center gap-2 mt-1">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: data.fill }} />
            <span>Progress: {data.progress}%</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1 uppercase">Status: {data.status.replace('_', ' ')}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full select-none">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
          barSize={14}
        >
          <XAxis 
            type="number" 
            domain={[0, 100]} 
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis 
            dataKey="category" 
            type="category" 
            tick={{ fill: '#475569', fontSize: 12, fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
            width={150}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(241, 245, 249, 0.5)' }} />
          <Bar dataKey="progress" radius={[0, 8, 8, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} className="transition-all duration-300 hover:opacity-85" />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
