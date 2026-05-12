import { FC } from 'react';
import { Repeat, Mountain, Box, CalendarDays, Plus, Grid3x3 } from 'lucide-react';
import { CONTAINER, GLOW, colors } from '../constants/colors';

interface HubPill {
  label: string;
  hash: string;
  color: string;
  Icon: typeof Plus;
}

const PILLS: HubPill[] = [
  { label: 'Nawyki', hash: '#nawyki', color: colors.q2, Icon: Repeat },
  { label: 'Wielkie Projekty', hash: '#projekty', color: colors.q1, Icon: Mountain },
  { label: 'Inne', hash: '#inne', color: colors.q4, Icon: Box },
  { label: 'Kalendarz', hash: '#kalendarz', color: colors.neonPurple, Icon: CalendarDays },
  { label: 'Dodaj zadanie', hash: '#dodaj', color: colors.q3, Icon: Plus },
  { label: 'Macierz', hash: '#macierz', color: colors.neonGreen, Icon: Grid3x3 },
];

export const CentrumPlanowania: FC = () => {
  return (
    <div className={CONTAINER}>
      <header className="space-y-1">
        <p className="text-[10px] font-black uppercase tracking-qlabel text-textSecondary">Hub</p>
        <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Centrum Planowania</h2>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {PILLS.map(({ label, hash, color, Icon }) => (
          <button
            key={hash}
            onClick={() => { window.location.hash = hash; }}
            className="rounded-card bg-panel border-2 p-5 flex flex-col items-start gap-3 active:scale-95 transition-transform"
            style={{ borderColor: color, boxShadow: GLOW.ring(color) }}
          >
            <Icon size={22} style={{ color }} />
            <span className="text-white font-black uppercase tracking-qlabel text-sm text-left">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CentrumPlanowania;
