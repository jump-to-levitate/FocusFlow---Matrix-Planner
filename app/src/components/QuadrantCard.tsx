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
  lime: 'border-[#39FF14] shadow-[0_0_15px_rgba(57,255,20,0.6),0_0_40px_rgba(57,255,20,0.15)]',
  purple: 'border-[#A855F7] shadow-[0_0_15px_rgba(168,85,247,0.6),0_0_40px_rgba(168,85,247,0.15)]',
  cyan: 'border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.6),0_0_40px_rgba(0,240,255,0.15)]',
  slate: 'border-slate-500/70 shadow-[0_0_10px_rgba(100,116,139,0.3)]',
};

const bgClasses = {
  lime: 'bg-[rgba(57,255,20,0.08)]',
  purple: 'bg-[rgba(168,85,247,0.08)]',
  cyan: 'bg-[rgba(0,240,255,0.08)]',
  slate: 'bg-slate-500/5',
};

const titleColorClasses = {
  lime: 'text-[#39FF14]',
  purple: 'text-[#A855F7]',
  cyan: 'text-[#00F0FF]',
  slate: 'text-slate-400',
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
          <span className={`text-[10px] min-[360px]:text-xs font-black ${titleColorClasses[color]}`}>Q{quadrant}</span>
        </div>
        <h3 className={`text-[11px] min-[360px]:text-sm font-extrabold uppercase tracking-wide leading-tight ${titleColorClasses[color]}`}>
          {title}
        </h3>
        {/* hyphens-auto prevents long words from breaking the Matrix layout */}
        <p className="text-[10px] min-[360px]:text-xs text-white/50 hyphens-auto leading-snug mt-0.5">
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
