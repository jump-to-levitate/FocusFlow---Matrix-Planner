import { useMemo } from 'react';
import type { Task, Q2Subcategory } from '../db/dexie';

interface Q2TileProps {
  title: string;
  subcategory: Q2Subcategory;
  tasks: Task[];
  color: string;
  onTaskClick?: (task: Task) => void;
  icon?: React.ReactNode;
}

export const Q2Tile = ({ title, subcategory, tasks, color, onTaskClick, icon }: Q2TileProps) => {
  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt.getTime() : Date.parse(String(a.createdAt));
      const dateB = b.createdAt instanceof Date ? b.createdAt.getTime() : Date.parse(String(b.createdAt));
      return dateB - dateA;
    });
  }, [tasks]);

  const count = tasks.length;

  return (
    <div
      data-subcategory={subcategory}
      className="bg-[#130B24] border border-[#1F192F] rounded-xl overflow-hidden flex flex-col min-w-0"
    >
      <div
        className="h-14 px-3 flex items-center justify-between border-b border-[#1F192F]/50 shrink-0"
        style={{ borderLeftColor: color, borderLeftWidth: '3px' }}
      >
        <div className="flex items-center gap-2 overflow-hidden min-w-0">
          {icon && <span style={{ color }} className="shrink-0">{icon}</span>}
          <span className="font-semibold text-sm whitespace-nowrap text-white truncate">
            {title}
          </span>
        </div>
        <span className="text-xs font-mono px-2 py-1 bg-[#1F192F] text-[#A78BFA] rounded-md border border-[#2A223F] shrink-0 whitespace-nowrap">
          {count}
        </span>
      </div>

      <div className="flex-1 p-2 space-y-1 min-h-[120px] max-h-[200px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#1F192F]">
        {sortedTasks.map(task => (
          <button
            key={task.id}
            onClick={() => onTaskClick?.(task)}
            className="w-full text-left p-2 bg-[#1A0F30]/50 hover:bg-[#1A0F30] rounded-lg text-xs text-[#E8D5FF] transition-colors truncate"
          >
            {task.title}
          </button>
        ))}
        {sortedTasks.length === 0 && (
          <div className="h-full flex items-center justify-center text-[#6B7280] text-xs italic">
            Brak zadań
          </div>
        )}
      </div>
    </div>
  );
};
