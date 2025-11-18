'use client';

import { useState } from 'react';
import Dashboard from '@/components/dashboard/Dashboard';
import Timeline from '@/components/dashboard/Timeline';
import { dashboardData, timelineData } from '@/lib/data';

export default function Home() {
  const [view, setView] = useState<'dashboard' | 'timeline'>('dashboard');

  const handleStartPractice = () => {
    alert('Starting practice session! 🚀');
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <h1 className="text-xl font-bold text-slate-800">Practice Dashboard</h1>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    view === 'dashboard'
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setView('timeline')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition ${
                    view === 'timeline'
                      ? 'bg-sky-100 text-sky-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Timeline
                </button>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              🎯 Your learning roadmap
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      {view === 'dashboard' ? (
        <Dashboard data={dashboardData} onStartPractice={handleStartPractice} />
      ) : (
        <Timeline data={timelineData} />
      )}
    </div>
  );
}
