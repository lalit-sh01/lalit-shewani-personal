'use client';

import React from 'react';
import { DashboardData } from '@/lib/data';
import KPI from './KPI';

interface DashboardProps {
  data: DashboardData;
  onStartPractice: () => void;
}

export default function Dashboard({ data, onStartPractice }: DashboardProps) {
  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800">{data.title}</h1>
          <p className="text-sm text-slate-500 mt-1">Primary motivation: {data.motivation}</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="px-3 py-2 rounded-md border text-sm hover:bg-slate-50 transition">
            Share
          </button>
          <button
            onClick={onStartPractice}
            className="px-4 py-2 rounded-md bg-sky-600 text-white text-sm shadow-md hover:bg-sky-700 transition"
          >
            Start practice
          </button>
        </div>
      </header>

      <section className="mb-6">
        <div className="flex gap-3 overflow-auto py-2">
          {data.phases.map(p => (
            <div key={p.id} className="min-w-[220px] bg-white rounded-lg p-4 shadow-sm border">
              <div className="text-sm font-semibold text-slate-700">{p.title}</div>
              <div className="text-xs text-slate-400">{p.start} — {p.end}</div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-2 rounded-full bg-sky-500 transition-all duration-300"
                    style={{width: `${p.progress}%`}}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-2">{p.progress}% complete</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-4 mb-6">
        {data.kpis.map((k, index) => (
          <KPI
            key={k.id}
            title={k.title}
            value={k.value}
            small={index === 0 ? 'last week 40%' : undefined}
          />
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-2">Upcoming milestone</h2>
        <div className="bg-white p-4 rounded-lg shadow-sm border flex items-center justify-between">
          <div>
            <div className="font-medium">{data.upcoming.title}</div>
            <div className="text-xs text-slate-500 mt-1">
              Due {data.upcoming.due} — {data.upcoming.progress}% complete
            </div>
          </div>
          <div>
            <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm hover:bg-emerald-700 transition">
              Open milestone
            </button>
          </div>
        </div>
      </section>

      <footer className="text-xs text-slate-400">
        Tip: drag phases to re-order in the timeline view.
      </footer>
    </div>
  );
}
