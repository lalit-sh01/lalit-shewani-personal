'use client';

import React, { useState } from 'react';
import { TimelineData, Task } from '@/lib/data';
import TaskRow from './TaskRow';

interface TimelineProps {
  data: TimelineData;
}

export default function Timeline({ data }: TimelineProps) {
  const [tasks, setTasks] = useState<Task[]>(data.initialTasks);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-extrabold text-slate-800 mb-6">{data.title}</h1>

        <div className="grid grid-cols-12 gap-6">
          {/* Main timeline area */}
          <main className="col-span-8">
            <div className="space-y-4">
              {data.lanes.map(l => (
                <div key={l.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div>
                    <div className="font-medium">{l.title}</div>
                    <div className="text-xs text-slate-400">{l.items.length} items</div>
                  </div>

                  <div className="mt-3 flex gap-2 overflow-auto pb-2">
                    {l.items.map(it => (
                      <div
                        key={it.id}
                        className={`min-w-[180px] p-3 rounded-lg shadow-sm border cursor-grab hover:shadow-md transition ${
                          it.type === 'milestone'
                            ? 'bg-amber-50 border-amber-200'
                            : 'bg-white'
                        }`}
                      >
                        <div className="font-medium text-sm">{it.title}</div>
                        <div className="text-xs text-slate-500 mt-1">Due {it.due}</div>
                        <div className="mt-2 text-xs text-slate-400">Drag to reschedule</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </main>

          {/* Right rail detail */}
          <aside className="col-span-4 space-y-4">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <h3 className="font-semibold">Milestone: {data.milestone.title}</h3>
              <div className="text-xs text-slate-500">Due: {data.milestone.due}</div>

              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Tasks</div>
                <div className="divide-y">
                  {tasks.map(t => (
                    <TaskRow key={t.id} task={t} onToggle={toggleTask} />
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Resources</div>
                <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                  {data.milestone.resources.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-4 flex gap-2">
                <button className="px-3 py-2 rounded bg-sky-600 text-white text-sm hover:bg-sky-700 transition">
                  Mark milestone done
                </button>
                <button className="px-3 py-2 rounded border text-sm hover:bg-slate-50 transition">
                  Edit
                </button>
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="text-sm font-medium mb-2">Quick actions</div>
              <div className="flex flex-col gap-2">
                <button className="px-3 py-2 rounded border text-sm text-left hover:bg-slate-50 transition">
                  Add task
                </button>
                <button className="px-3 py-2 rounded border text-sm text-left hover:bg-slate-50 transition">
                  Add milestone
                </button>
                <button className="px-3 py-2 rounded border text-sm text-left hover:bg-slate-50 transition">
                  Open skill tree
                </button>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
