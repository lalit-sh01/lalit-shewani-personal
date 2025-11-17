import React from 'react';
import { Task } from '@/lib/data';

interface TaskRowProps {
  task: Task;
  onToggle: (id: string) => void;
}

export default function TaskRow({ task, onToggle }: TaskRowProps) {
  return (
    <div className="py-2 flex items-center gap-3">
      <input
        type="checkbox"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        className="w-4 h-4 rounded border-slate-300 text-sky-600 cursor-pointer"
      />
      <span className={`text-sm ${task.done ? 'line-through text-slate-400' : 'text-slate-700'}`}>
        {task.title}
      </span>
    </div>
  );
}
