import React from 'react';

interface KPIProps {
  title: string;
  value: string;
  small?: string;
}

export default function KPI({ title, value, small }: KPIProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <div className="text-sm text-slate-600 mb-1">{title}</div>
      <div className="text-2xl font-bold text-slate-800">{value}</div>
      {small && <div className="text-xs text-slate-400 mt-1">{small}</div>}
    </div>
  );
}
