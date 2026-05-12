import { FC, useRef } from 'react';
import { Task, ContextAction } from '../types';
import { QUADRANT_COLOR } from '../constants/colors';

interface TaskCardProps {
  task: Task;
  variant: 'pill' | 'card' | 'matrix';
  onAction?: (action: ContextAction) => void;
  onClick?: () => void;
}

export const TaskCard: FC<TaskCardProps> = ({ task, variant, onAction, onClick }) => {
  const timerRef = useRef<number | null>(null);
  const longPressed = useRef(false);

  const startPress = () => {
    longPressed.current = false;
    timerRef.current = window.setTimeout(() => {
      longPressed.current = true;
      onAction?.('openMenu');
    }, 500);
  };
  const cancelPress = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };
  const handleClick = () => {
    if (longPressed.current) return;
    onClick?.();
  };

  const color = QUADRANT_COLOR[task.quadrant];
  const completing = task.isCompleting === true;
  const baseTransition = 'transition-all duration-200 ease-out';
  const completionClass = completing ? 'opacity-0 -translate-x-full' : 'opacity-100 translate-x-0';

  if (variant === 'pill') {
    return (
      <button
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        onClick={handleClick}
        className={`w-full rounded-pill px-4 py-2 text-left text-xs font-semibold text-white truncate bg-panel border ${baseTransition} ${completionClass}`}
        style={{ borderColor: color, boxShadow: `0 0 8px ${color}33` }}
      >
        {task.title}
      </button>
    );
  }

  if (variant === 'matrix') {
    return (
      <button
        onMouseDown={startPress}
        onMouseUp={cancelPress}
        onMouseLeave={cancelPress}
        onTouchStart={startPress}
        onTouchEnd={cancelPress}
        onClick={handleClick}
        className={`w-full rounded-card px-3 py-2 text-left text-[11px] font-semibold text-white truncate bg-slate900 border ${baseTransition} ${completionClass}`}
        style={{ borderColor: color, boxShadow: `0 0 6px ${color}44` }}
      >
        {task.title}
      </button>
    );
  }

  return (
    <button
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onClick={handleClick}
      className={`w-full rounded-card p-4 text-left text-white bg-panel border-2 ${baseTransition} ${completionClass}`}
      style={{ borderColor: color, boxShadow: `0 0 12px ${color}55` }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-[10px] font-black uppercase tracking-qlabel" style={{ color }}>Q{task.quadrant}</span>
        <span className="text-[10px] text-textSecondary">{task.category}</span>
      </div>
      <p className="text-sm font-bold leading-tight">{task.title}</p>
      {task.description && <p className="text-[11px] text-textSecondary mt-1 line-clamp-2">{task.description}</p>}
    </button>
  );
};

export default TaskCard;
