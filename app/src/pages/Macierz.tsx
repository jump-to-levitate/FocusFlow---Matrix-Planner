import { FC } from 'react';
import { Quadrant } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { selectByQuadrant, selectOpen } from '../store/selectors';
import TaskCard from '../components/TaskCard';
import { CONTAINER, GLOW, QUADRANT_COLOR, QUADRANT_LABEL, QUADRANT_CLASSES } from '../constants/colors';

const Q_CTA: Record<Quadrant, { cta: string; hash: string }> = {
  I: { cta: 'Otworz Timer', hash: '#timer' },
  II: { cta: 'Plan Strategiczny', hash: '#centrum-planowania' },
  III: { cta: 'Proza Zycia', hash: '#proza' },
  IV: { cta: 'Archiwum', hash: '#archiwum' },
};

export const Macierz: FC = () => {
  const { tasks } = useTasksStore();
  const open = selectOpen(tasks);
  return (
    <div className={CONTAINER}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Macierz Eisenhowera</h2>
      <div className="grid grid-cols-2 gap-6 auto-rows-fr">
        {(['I', 'II', 'III', 'IV'] as Quadrant[]).map(q => {
          const klass = QUADRANT_CLASSES[q];
          const cta = Q_CTA[q];
          const items = selectByQuadrant(open, q).slice(0, 5);
          return (
            <div
              key={q}
              className={`rounded-card p-4 border bg-panel flex flex-col min-h-[220px] ${klass.border}`}
              style={{ boxShadow: GLOW.ring(QUADRANT_COLOR[q]) }}
            >
              <header className="flex items-baseline justify-between mb-3">
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[10px] font-black uppercase tracking-qlabel ${klass.text}`}>
                    Q{q}
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-qlabel text-textSecondary leading-tight">
                    {QUADRANT_LABEL[q]}
                  </span>
                </div>
                <span className="text-2xl font-black text-white leading-none">{items.length}</span>
              </header>
              <ul className="space-y-1.5 flex-1">
                {items.map(t => (
                  <li key={t.id}><TaskCard task={t} variant="matrix" /></li>
                ))}
                {items.length === 0 && (
                  <li className="text-[11px] text-textSecondary">brak zadan</li>
                )}
              </ul>
              <button
                onClick={() => { window.location.hash = cta.hash; }}
                className={`mt-4 py-2 rounded-pill text-[10px] font-black uppercase tracking-qlabel text-midnight ${klass.bg}`}
              >
                {cta.cta}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Macierz;
