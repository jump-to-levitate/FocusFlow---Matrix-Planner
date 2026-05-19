import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check, Play, Pause, Square } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTimer } from '../context/TimerContext';
import { TIMER_PRESETS } from '../constants/timerPresets';
import { db } from '../db/dexie';

const PRESET_LABELS: Record<string, string> = {
  quick5: 'Przełam paraliż (5 min)',
  quick10: 'Szybki Brain Dump (10 min)',
  pomodoro15: 'Krótki sprint (15 min)',
  pomodoro25: 'Klasyczne Pomodoro (25 min)',
  deep45: 'Time Boxing (45 min)',
  deep50: 'Głęboka praca (50 min)',
  deep90: 'Hiperfocus (90 min)',
};

const QUADRANT_COLORS: Record<number, string> = {
  1: '#00FF66',
  2: '#D000FF',
  3: '#FF8C00',
  4: '#9CA3AF',
  0: '#6B7280',
};

export const TimerScreen = () => {
  const navigate = useNavigate();
  const { state, session, derived, startTimer, pauseTimer, resumeTimer, stopTimer } = useTimer();

  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const tasks = useLiveQuery(() => db.tasks.toArray()) ?? [];
  const activeTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  
  const currentTask = useMemo(() => {
    const id = session ? session.taskId : selectedTaskId;
    return tasks.find(t => t.id === id) || null;
  }, [tasks, session, selectedTaskId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTaskDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const displayTime = useMemo(() => {
    const mins = String(derived.remainingMinutes).padStart(2, '0');
    const secs = String(derived.remainingSeconds).padStart(2, '0');
    return `${mins}:${secs}`;
  }, [derived.remainingMinutes, derived.remainingSeconds]);

  const isIdle = state === 'idle';
  const isRunning = state === 'running';
  const isPaused = state === 'paused';

  return (
    <div className="w-full h-[calc(100vh-3.5rem)] flex flex-col justify-between bg-[#0A0512] text-white font-sans">
      <header className="h-14 w-full border-b border-[#1F192F] px-4 flex items-center justify-between bg-[#0E081B]/80 backdrop-blur-md sticky top-0 z-50">
        <button onClick={() => navigate(-1)} className="text-[#9CA3AF] hover:text-white transition-colors text-sm flex items-center gap-1">
          ← <span className="whitespace-nowrap">Matryca</span>
        </button>
        <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#A78BFA] tracking-wide uppercase whitespace-nowrap">
          Strefa Skupienia
        </h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 flex flex-col items-center justify-between px-6 py-4 overflow-hidden mb-20">
        <div className="w-full relative z-40" ref={dropdownRef}>
          <label className="block text-xs font-semibold text-[#7C3AED] uppercase tracking-wider mb-2 px-1 whitespace-nowrap">Aktualny Cel:</label>
          <button
            disabled={!isIdle}
            onClick={() => setShowTaskDropdown(!showTaskDropdown)}
            className={`w-full h-12 bg-[#130B24] border ${showTaskDropdown ? 'border-[#D000FF]' : 'border-[#1F192F]'} rounded-xl px-4 flex items-center justify-between text-left transition-all ${!isIdle ? 'opacity-60 cursor-not-allowed' : 'hover:border-[#3B2E54]'}`}
          >
            {currentTask ? (
              <div className="flex items-center gap-3 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0 animate-pulse" style={{ backgroundColor: QUADRANT_COLORS[currentTask.quadrant ?? 0] }} />
                <span className="text-sm font-medium truncate">{currentTask.title}</span>
              </div>
            ) : (
              <span className="text-sm text-[#6B7280]">Wybierz zadanie...</span>
            )}
            {isIdle && <ChevronDown className="w-4 h-4 text-[#9CA3AF]" />}
          </button>

          {showTaskDropdown && isIdle && (
            <div className="absolute top-[76px] left-0 right-0 bg-[#130B24] border border-[#1F192F] rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto z-50">
              <div className="px-4 py-3 text-xs font-semibold text-[#6B7280] hover:bg-[#1A0F30] cursor-pointer border-b border-[#1F192F]/50" onClick={() => { setSelectedTaskId(null); setShowTaskDropdown(false); }}>
                <span>Brak powiązanego zadania</span>
              </div>
              {activeTasks.map(task => (
                <div key={task.id} onClick={() => { setSelectedTaskId(task.id ?? null); setShowTaskDropdown(false); }} className="px-4 py-3 flex items-center justify-between hover:bg-[#1A0F30] cursor-pointer transition-colors border-b border-[#1F192F]/30">
                  <div className="flex items-center gap-3 overflow-hidden pr-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: QUADRANT_COLORS[task.quadrant ?? 0] }} />
                    <span className="text-sm truncate">{task.title}</span>
                  </div>
                  {(session?.taskId === task.id || selectedTaskId === task.id) && <Check className="w-4 h-4 text-[#00FF66]" />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="absolute inset-0 bg-[#D000FF]/5 blur-3xl rounded-full scale-75" />
          <div className="text-7xl font-mono font-black tracking-tight select-none text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-[#E8D5FF]">{displayTime}</div>
        </div>

        <div className="text-center h-6">
          {isRunning && <p className="text-xs text-[#00FF66] font-medium tracking-wide uppercase animate-pulse">Trwa sesja głębokiej pracy...</p>}
          {isPaused && <p className="text-xs text-[#FF8C00] font-medium tracking-wide uppercase">Skupienie zamrożone</p>}
          {state === 'completed' && <p className="text-xs text-[#D000FF] font-semibold tracking-wide uppercase">🏆 Sukces! Dopamina uwolniona!</p>}
        </div>

        <div className="w-full flex justify-center items-center gap-6 pt-2">
          {isRunning && (
            <button onClick={pauseTimer} className="w-16 h-16 bg-[#1F192F] hover:bg-[#2A223F] border border-[#3B2E54] rounded-full flex items-center justify-center transition-all shadow-lg">
              <Pause className="w-6 h-6 text-white" />
            </button>
          )}
          {isPaused && (
            <>
              <button onClick={resumeTimer} className="w-16 h-16 bg-gradient-to-r from-[#00FF66] to-[#00D154] rounded-full flex items-center justify-center transition-all shadow-xl">
                <Play className="w-6 h-6 text-[#0A0512] fill-[#0A0512] ml-0.5" />
              </button>
              <button onClick={stopTimer} className="w-12 h-12 bg-[#130B24] hover:bg-red-950/30 border border-red-900/30 rounded-full flex items-center justify-center transition-all">
                <Square className="w-4 h-4 text-red-400 fill-red-400/20" />
              </button>
            </>
          )}
        </div>

        {isIdle && (
          <div className="w-full space-y-3 pt-2 mt-auto">
            <span className="block text-xs font-semibold text-[#7C3AED] uppercase tracking-wider mb-2 px-1">Wybierz tryb dopaminowy:</span>
            <div className="grid grid-cols-1 gap-2.5 max-h-[180px] overflow-y-auto w-full pr-1">
              {TIMER_PRESETS.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => startTimer(preset.id, selectedTaskId)}
                  className="w-full h-12 bg-[#130B24] border border-[#1F192F] text-[#9CA3AF] rounded-xl px-4 flex items-center justify-between text-left hover:border-[#3B2E54] hover:text-white transition-all"
                >
                  <span className="text-sm font-medium">{PRESET_LABELS[preset.id] || preset.label}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-[#1F192F] text-[#A78BFA] rounded-md border border-[#2A223F]">{preset.focusMinutes}m</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
