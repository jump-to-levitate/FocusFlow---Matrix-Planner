import { useEffect, useState } from 'react';
import type { FC } from 'react';
import FocusSession from './pages/FocusSession';
import { BrainDump } from './pages/BrainDump';
import Pulpit from './pages/Pulpit';
import Macierz from './pages/Macierz';
import DoZrobieniaDzis from './pages/DoZrobieniaDzis';
import WszystkoNaDzis from './pages/WszystkoNaDzis';
import AktywnoscDnia from './pages/AktywnoscDnia';
import Nawyki from './pages/Nawyki';
import WielkieProjekty from './pages/WielkieProjekty';
import Inne from './pages/Inne';
import ProzaZycia from './pages/ProzaZycia';
import Archiwum from './pages/Archiwum';
import Raporty from './pages/Raporty';
import DodajZadanie from './pages/DodajZadanie';
import Notatnik from './pages/Notatnik';
import Notatki from './pages/Notatki';
import Kalendarz from './pages/Kalendarz';
import CentrumPlanowania from './pages/CentrumPlanowania';
import Onboarding, { hasOnboarded } from './pages/Onboarding';

type Route =
  | '#pulpit' | '#macierz' | '#timer' | '#braindump' | '#notatki' | '#notatnik' | '#today'
  | '#do-dzis' | '#aktywnosc' | '#nawyki' | '#projekty' | '#inne' | '#proza'
  | '#archiwum' | '#raporty' | '#dodaj' | '#centrum-planowania' | '#kalendarz';

const ALL_ROUTES: Route[] = [
  '#pulpit', '#macierz', '#timer', '#braindump', '#notatki', '#notatnik', '#today',
  '#do-dzis', '#aktywnosc', '#nawyki', '#projekty', '#inne', '#proza',
  '#archiwum', '#raporty', '#dodaj', '#centrum-planowania', '#kalendarz',
];

const parseRoute = (): Route => {
  const h = window.location.hash.split('?')[0] as Route;
  if (ALL_ROUTES.includes(h)) return h;
  return '#pulpit';
};

const NAV: { hash: Route; label: string }[] = [
  { hash: '#pulpit', label: 'Pulpit' },
  { hash: '#today', label: 'Dzis' },
  { hash: '#macierz', label: 'Macierz' },
  { hash: '#braindump', label: 'Brain' },
  { hash: '#centrum-planowania', label: 'Hub' },
  { hash: '#raporty', label: 'Raporty' },
];

const NavButton: FC<{ hash: Route; label: string; active: boolean }> = ({ hash, label, active }) => (
  <button
    onClick={() => { window.location.hash = hash; }}
    className={`px-3 py-1.5 rounded-pill text-[10px] font-black uppercase tracking-qlabel transition-colors ${active ? 'bg-neonGreen text-midnight' : 'bg-slate800 text-white'}`}
  >
    {label}
  </button>
);

export default function AppShell() {
  const [route, setRoute] = useState<Route>(parseRoute());
  const [onboarded, setOnboarded] = useState<boolean>(() => hasOnboarded());

  useEffect(() => {
    const onHash = () => setRoute(parseRoute());
    window.addEventListener('hashchange', onHash);
    if (!window.location.hash) window.location.hash = '#pulpit';
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!onboarded) {
    return <Onboarding onDone={() => setOnboarded(true)} />;
  }

  const renderRoute = (): JSX.Element => {
    switch (route) {
      case '#pulpit': return <Pulpit />;
      case '#macierz': return <Macierz />;
      case '#timer': return <FocusSession />;
      case '#braindump': return <BrainDump />;
      case '#notatki': return <Notatki />;
      case '#notatnik': return <Notatnik />;
      case '#today': return <WszystkoNaDzis />;
      case '#do-dzis': return <DoZrobieniaDzis />;
      case '#aktywnosc': return <AktywnoscDnia />;
      case '#nawyki': return <Nawyki />;
      case '#projekty': return <WielkieProjekty />;
      case '#inne': return <Inne />;
      case '#proza': return <ProzaZycia />;
      case '#archiwum': return <Archiwum />;
      case '#raporty': return <Raporty />;
      case '#dodaj': return <DodajZadanie />;
      case '#centrum-planowania': return <CentrumPlanowania />;
      case '#kalendarz': return <Kalendarz />;
      default: return <Pulpit />;
    }
  };

  return (
    <div className="min-h-screen bg-slate900 text-white">
      <header className="fixed top-0 left-0 right-0 z-20 border-b border-white/5 bg-black/50 backdrop-blur-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <h1 className="text-xl font-black text-neonGreen tracking-qlabel">FocusFlow [TEST OK]</h1>
          <nav className="flex gap-2 flex-wrap justify-end">
            {NAV.map(n => (
              <NavButton key={n.hash} hash={n.hash} label={n.label} active={route === n.hash} />
            ))}
          </nav>
        </div>
      </header>
      <main className="max-w-3xl mx-auto pt-20">
        {renderRoute()}
      </main>
    </div>
  );
}
