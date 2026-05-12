import { FC, useRef, useState } from 'react';
import { Grid3x3, Zap, BarChart3 } from 'lucide-react';
import { CONTAINER, GLOW, colors } from '../constants/colors';

const STORAGE_KEY = 'ff_onboarded_v1';

interface OnboardingProps {
  onDone: () => void;
}

interface Slide {
  Icon: typeof Grid3x3;
  color: string;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    Icon: Grid3x3,
    color: colors.q1,
    title: 'Macierz Eisenhowera',
    body: 'Klasyfikuj zadania w 4 cwiartkach. Maksymalnie 5 w Q1 zeby uniknac przeciazenia.',
  },
  {
    Icon: Zap,
    color: colors.neonGreen,
    title: 'Brain Dump + Focus',
    body: 'Wrzuc co Ci chodzi po glowie, odpowiedz na 6 pytan, uruchom timer 25/5.',
  },
  {
    Icon: BarChart3,
    color: colors.neonPurple,
    title: 'Streak + Raporty',
    body: 'Sledz streak codziennego focusu, tygodniowe minuty pracy i ukonczone zadania.',
  },
];

export const hasOnboarded = (): boolean => {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return true;
  }
};

export const Onboarding: FC<OnboardingProps> = ({ onDone }) => {
  const [idx, setIdx] = useState(0);
  const startXRef = useRef<number | null>(null);

  const goNext = () => {
    if (idx < SLIDES.length - 1) {
      setIdx(idx + 1);
      return;
    }
    try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ }
    onDone();
  };

  const goPrev = () => {
    if (idx > 0) setIdx(idx - 1);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (startXRef.current === null) return;
    const dx = e.changedTouches[0].clientX - startXRef.current;
    startXRef.current = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) goNext();
    else goPrev();
  };

  const slide = SLIDES[idx];
  const isLast = idx === SLIDES.length - 1;
  const { Icon } = slide;

  return (
    <div className="fixed inset-0 z-50 bg-slate900" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      <div className={`${CONTAINER} max-w-md mx-auto min-h-screen flex flex-col justify-between`}>
        <header className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase tracking-qlabel text-textSecondary">
            Krok {idx + 1} / {SLIDES.length}
          </span>
          <button
            onClick={() => { try { localStorage.setItem(STORAGE_KEY, 'true'); } catch { /* noop */ } onDone(); }}
            className="text-textSecondary text-[10px] font-black uppercase tracking-qlabel"
          >Pomin</button>
        </header>

        <section className="flex-1 flex flex-col items-center justify-center gap-6 text-center">
          <div
            className="w-32 h-32 rounded-card flex items-center justify-center bg-panel border-2"
            style={{ borderColor: slide.color, boxShadow: GLOW.hero(slide.color) }}
          >
            <Icon size={64} style={{ color: slide.color }} />
          </div>
          <h2 className="text-white text-3xl font-black uppercase tracking-qlabel">{slide.title}</h2>
          <p className="text-textSecondary text-sm max-w-xs">{slide.body}</p>
        </section>

        <footer className="space-y-4">
          <div className="flex justify-center gap-2">
            {SLIDES.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-pill transition-all ${i === idx ? 'w-8 bg-neonGreen' : 'w-2 bg-slate800'}`}
              />
            ))}
          </div>
          <button
            onClick={goNext}
            className="w-full py-3 rounded-pill bg-neonGreen text-midnight font-black uppercase tracking-qlabel"
            style={{ boxShadow: GLOW.ring(colors.neonGreen) }}
          >{isLast ? 'Zaczynamy' : 'Dalej'}</button>
        </footer>
      </div>
    </div>
  );
};

export default Onboarding;
