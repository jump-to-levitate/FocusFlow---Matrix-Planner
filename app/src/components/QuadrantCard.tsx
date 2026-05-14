// ============================================================================
// FocusFlow 2.0 - Quadrant Card Component
// Individual quadrant display for Matrix 2×2
// PDF Reference: str. 16
// ============================================================================

import { ReactNode } from 'react';

interface QuadrantCardProps {
  quadrant: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  color: 'lime' | 'purple' | 'cyan' | 'slate';
  children?: ReactNode;
}

const colorClasses = {
  lime: 'border-neon-lime/50 shadow-[0_0_20px_rgba(57,255,20,0.3)]',
  purple: 'border-neon-purple/50 shadow-[0_0_20px_rgba(168,85,247,0.3)]',
  cyan: 'border-neon-cyan/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]',
  slate: 'border-slate-500/50',
};

const bgClasses = {
  lime: 'bg-neon-lime/5',
  purple: 'bg-neon-purple/5',
  cyan: 'bg-neon-cyan/5',
  slate: 'bg-slate-500/5',
};

export const QuadrantCard = ({ 
  quadrant, 
  title, 
  subtitle, 
  color, 
  children 
}: QuadrantCardProps) => {
  return (
    <div 
      className={`
        relative rounded-xl border backdrop-blur-sm 
        p-2 min-[360px]:p-4
        ${colorClasses[color]}
        ${bgClasses[color]}
        min-h-[160px] min-[360px]:min-h-[200px]
        transition-all duration-200 hover:scale-[1.02]
      `}
    >
      {/* Header */}
      <div className="mb-2 min-[360px]:mb-3">
        <div className="flex items-center gap-1.5 min-[360px]:gap-2 mb-1">
          <span className="text-[10px] min-[360px]:text-xs font-bold text-white/60">Q{quadrant}</span>
          <h3 className="text-[11px] min-[360px]:text-sm font-semibold text-white leading-tight">
            {title}
          </h3>
        </div>
        {/* hyphens-auto prevents long words from breaking the Matrix layout */}
        <p className="text-[10px] min-[360px]:text-xs text-white/50 hyphens-auto leading-snug">
          {subtitle}
        </p>
      </div>
      
      {/* Content (empty state or tasks) */}
      <div className="flex-1">
        {children || (
          <div className="flex flex-col items-center justify-center h-20 min-[360px]:h-24 text-white/30">
            <p className="text-[10px] min-[360px]:text-xs text-center">Brak zadań</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadrantCard;
