// ============================================================================
// FocusFlow 2.0 - Quadrant Card Component
// Individual quadrant display for Matrix 2×2
// PDF Reference: str. 16
// ============================================================================

import { ReactNode } from 'react';
import { Plus } from 'lucide-react';

interface QuadrantCardProps {
  quadrant: 1 | 2 | 3 | 4;
  title: string;
  subtitle: string;
  color: 'lime' | 'purple' | 'orange' | 'slate';
  children?: ReactNode;
  onAdd?: () => void;
}

const colorClasses = {
  lime: 'border-[#39FF14] shadow-[0_0_20px_rgba(57,255,20,0.6),0_0_50px_rgba(57,255,20,0.15)]',
  purple: 'border-[#D000FF] shadow-[0_0_30px_rgba(208,0,255,0.7),0_0_60px_rgba(208,0,255,0.2)]',
  orange: 'border-[#FF8C00] shadow-[0_0_20px_rgba(255,140,0,0.6),0_0_50px_rgba(255,140,0,0.15)]',
  slate: 'border-slate-500/70 shadow-[0_0_12px_rgba(100,116,139,0.3)]',
};

const bgClasses = {
  lime: 'bg-[rgba(57,255,20,0.08)]',
  purple: 'bg-[rgba(208,0,255,0.10)]',
  orange: 'bg-[rgba(255,140,0,0.08)]',
  slate: 'bg-slate-500/5',
};

const titleColorClasses = {
  lime: 'text-[#39FF14]',
  purple: 'text-[#D000FF]',
  orange: 'text-[#FF8C00]',
  slate: 'text-slate-400',
};

export const QuadrantCard = ({ 
  quadrant, 
  title, 
  subtitle, 
  color, 
  children,
  onAdd,
}: QuadrantCardProps) => {
  return (
    <div 
      className={`
        relative rounded-xl border backdrop-blur-sm 
        p-3 min-[360px]:p-5
        ${colorClasses[color]}
        ${bgClasses[color]}
        h-full flex flex-col
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
      <div className="flex-1 flex flex-col">
        {children || (
          <div className="flex-1 flex flex-col items-center justify-center gap-2 text-white/30">
            <p className="text-[10px] min-[360px]:text-xs text-center">Brak zadań</p>
            {onAdd && (
              <button
                onClick={onAdd}
                className={`p-1.5 rounded-lg border border-dashed border-white/20 hover:border-white/40 transition-colors`}
              >
                <Plus size={14} className="text-white/30" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuadrantCard;
