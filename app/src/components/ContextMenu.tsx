import { FC, useEffect, useRef } from 'react';
import { Task, ContextAction } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { Check, Edit2, FileText, Play, Trash2 } from 'lucide-react';

interface ContextMenuProps {
  task: Task;
  onClose: () => void;
  onAction: (action: ContextAction) => void;
}

const ACTIONS: { kind: ContextAction; label: string; Icon: typeof Check }[] = [
  { kind: 'done', label: 'Oznacz jako zrobione', Icon: Check },
  { kind: 'startFocus', label: 'Start Focus', Icon: Play },
  { kind: 'edit', label: 'Edytuj', Icon: Edit2 },
  { kind: 'note', label: 'Dodaj notatke', Icon: FileText },
  { kind: 'delete', label: 'Usun', Icon: Trash2 },
];

export const ContextMenu: FC<ContextMenuProps> = ({ task, onClose, onAction }) => {
  const store = useTasksStore();
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [onClose]);

  const handleAction = async (kind: ContextAction) => {
    if (kind === 'edit') {
      window.location.hash = `#braindump?taskId=${task.id}`;
    } else if (kind === 'note') {
      window.location.hash = `#notatnik?taskId=${task.id}`;
    } else if (kind === 'delete') {
      await store.removeTask(task.id);
      window.location.hash = '#pulpit';
    } else {
      onAction(kind);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 animate-in fade-in duration-200">
      <div
        ref={ref}
        className="w-full max-w-sm rounded-t-card sm:rounded-card p-4 m-0 sm:m-4 animate-in slide-in-from-bottom-4 duration-200 bg-panel border border-panelBorder"
      >
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-2">{task.title}</p>
        <ul className="space-y-1">
          {ACTIONS.map(({ kind, label, Icon }) => (
            <li key={kind}>
              <button
                onClick={() => { void handleAction(kind); }}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-white text-sm hover:bg-slate-800 active:scale-[0.98] transition"
              >
                <Icon size={16} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ContextMenu;
