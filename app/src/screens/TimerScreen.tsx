import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronDown, Check } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { useTimer } from '../context/TimerContext';
import { formatTime, TIMER_PRESETS, type TimerPreset } from '../types/timer';
import { db } from '../db/dexie';

// Preset labels mapping to Polish
const PRESET_LABELS: Record<string, string> = {
  pogromca_5_0: 'Przełam paraliż',
  sprint_10_0: 'Szybki sprint',
  light_15_5: 'Lekkie',
  classic_25_5: 'Klasyczne',
  flow_50_10: 'Intensywne',
  deep_90_15: 'Głębokie',
  timebox: 'Time Boxing',
};

// Quadrant colors
const QUADRANT_COLORS: Record<number, string> = {
  1: '#00FF66', // Neon Green - Ważne/Pilne (Rób teraz)
  2: '#D000FF', // Purple - Centrum planowania
  3: '#FF8C00', // Orange - Proza życia
  4: '#9CA3AF', // Gray - Nie teraz
  0: '#6B7280', // Gray for unassigned
};

const getTaskColor = (quadrant: number): string => QUADRANT_COLORS[quadrant] ?? '#6B7280';

// Get total seconds for current mode
const getTotalSeconds = (mode: string | null, timeBoxSeconds: number): number => {
  if (!mode) return 0;
  if (mode === 'timebox') return timeBoxSeconds;
  const preset = TIMER_PRESETS.find(p => p.id === mode);
  return preset ? preset.workMinutes * 60 : 0;
};

export const TimerScreen = () => {
  const navigate = useNavigate();
  const {
    mode,
    timerState,
    timeLeft,
    activeTaskId,
    showCompletionModal,
    setShowCompletionModal,
    startTimer,
    startTimeBox,
    pauseTimer,
    resumeTimer,
    stopTimer,
    setActiveTask,
  } = useTimer();

  const [timeBoxInput, setTimeBoxInput] = useState('');
  const [timeBoxSeconds, setTimeBoxSeconds] = useState(0);
  const [showTaskDropdown, setShowTaskDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch all tasks live
  const allTasks = useLiveQuery(() => db.tasks.toArray()) ?? [];

  // Filter in JS: only incomplete and exclude Inbox (quadrant 0)
  const availableTasks = allTasks.filter(task => !task.completed && task.quadrant !== 0);

  // Sort in JS by quadrant ascending (Q1, Q2, Q3, Q4)
  const tasks = [...availableTasks].sort((a, b) => a.quadrant - b.quadrant);

  const activeTask = useMemo(() => {
    return tasks.find(t => t.id === activeTaskId) ?? null;
  }, [tasks, activeTaskId]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowTaskDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectTask = (taskId: number | null) => {
    setActiveTask(taskId);
    setShowTaskDropdown(false);
  };

  // Handler 1: Complete task (Green) - mark complete, close modal, clear selected task
  const handleCompleteTask = async () => {
    try {
      if (activeTaskId !== null && activeTaskId !== undefined) {
        // Bezpieczne rzutowanie na liczbę, aby IndexedDB bezbłędnie dopasowało klucz główny
        const numericId = Number(activeTaskId);

        console.log(`[Timer] Próba ukończenia zadania o ID: ${numericId} (typ: ${typeof numericId})`);

        // Wykonaj aktualizację w bazie Dexie
        const updatedRows = await db.tasks.update(numericId, { completed: true });

        if (updatedRows > 0) {
          console.log(`[Timer] Sukces! Zadanie o ID ${numericId} zostało oznaczone jako ukończone.`);
        } else {
          console.warn(`[Timer] Ostrzeżenie: Nie znaleziono zadania o ID ${numericId} w bazie danych.`);
        }
      } else {
        console.warn('[Timer] Nie można ukończyć zadania: activeTaskId jest puste (null/undefined).');
      }

      // Wyczyszczenie stanu i zamknięcie modalu
      setShowCompletionModal(false);
      if (typeof stopTimer === 'function') stopTimer(); // Pełny reset timera i czyszczenie activeTaskId
      setActiveTask(null);
    } catch (error) {
      console.error('[Timer] Krytyczny błąd podczas aktualizacji statusu zadania w Dexie:', error);
    }
  };

  // Handler 2: Another session (Purple) - just close modal, keep selected task
  const handleAnotherSession = () => {
    setShowCompletionModal(false);
    // Don't stop timer or clear selected task - user stays on screen
  };

  // Handler 3: Return later (Orange) - close modal, don't complete task, navigate to dashboard
  const handleReturnLater = () => {
    setShowCompletionModal(false);
    stopTimer();
    navigate('/');
  };

  const handleStartTimeBox = () => {
    if (timeBoxInput) {
      const [hours, minutes] = timeBoxInput.split(':').map(Number);
      const seconds = hours * 3600 + minutes * 60;
      setTimeBoxSeconds(seconds);
      startTimeBox(timeBoxInput);
    }
  };

  const handleSelectPreset = (preset: TimerPreset) => {
    if (preset.id === 'timebox') {
      startTimer(preset.id);
    } else {
      startTimer(preset.id);
    }
  };

  const isRunning = timerState === 'running';
  const isPaused = timerState === 'paused';
  const isIdle = timerState === 'idle';
  const isBreak = timerState === 'break';

  // SVG Circle calculations
  const radius = 120;
  const strokeWidth = 10;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;

  const totalSeconds = getTotalSeconds(mode, timeBoxSeconds);
  const progress = totalSeconds > 0 ? (totalSeconds - timeLeft) / totalSeconds : 0;
  const strokeDashoffset = circumference - progress * circumference;

  // Clock text styles based on state
  const clockTextClass = isRunning
    ? 'text-[#00FF66] drop-shadow-[0_0_15px_rgba(0,255,102,0.8)]'
    : isPaused
    ? 'text-[#7A0099]'
    : 'text-white/70';

  return (
    <div className="content-area flex flex-col items-center py-6 px-4 min-h-full">
      {/* Task Selector */}
      <div className="w-full max-w-sm mb-6" ref={dropdownRef}>
        <div
          onClick={() => setShowTaskDropdown(!showTaskDropdown)}
          className="relative px-4 py-3 rounded-xl bg-[#0A0A0C] border border-white/10 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 overflow-hidden">
              {activeTask ? (
                <>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: getTaskColor(activeTask.quadrant) }}
                  />
                  <span
                    className="text-sm font-medium truncate"
                    style={{ color: getTaskColor(activeTask.quadrant) }}
                  >
                    {activeTask.title}
                  </span>
                </>
              ) : (
                <span className="text-sm text-white/40">Nad jakim zadaniem chcesz pracować?</span>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 text-white/40 transition-transform ${showTaskDropdown ? 'rotate-180' : ''}`} />
          </div>

          {/* Dropdown Menu */}
          {showTaskDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-black border border-white/10 shadow-2xl shadow-black/50 z-50 max-h-60 overflow-y-auto">
              {/* No task option */}
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  handleSelectTask(null);
                }}
                className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5"
              >
                <span className="text-sm text-white/40">Brak konkretnego zadania</span>
              </div>

              {/* Tasks grouped by quadrant */}
              {[1, 2, 3, 4].map((quad) => {
                const quadTasks = tasks?.filter(t => t.quadrant === quad) ?? [];
                if (quadTasks.length === 0) return null;

                return (
                  <div key={quad}>
                    <div
                      className="px-4 py-2 text-xs font-medium uppercase tracking-wider bg-white/5"
                      style={{ color: getTaskColor(quad) }}
                    >
                      {quad === 1 && 'Ważne / Pilne'}
                      {quad === 2 && 'Centrum planowania'}
                      {quad === 3 && 'Proza życia'}
                      {quad === 4 && 'Nie teraz'}
                    </div>
                    {quadTasks.map((task) => (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectTask(task.id ?? null);
                        }}
                        className="px-4 py-3 hover:bg-white/5 cursor-pointer flex items-center gap-2"
                      >
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ backgroundColor: getTaskColor(task.quadrant) }}
                        />
                        <span className="text-sm text-white/80 truncate">{task.title}</span>
                        {activeTaskId === task.id && (
                          <Check className="w-4 h-4 ml-auto flex-shrink-0" style={{ color: getTaskColor(task.quadrant) }} />
                        )}
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Preset Buttons - 3x3 Cyberpunk Grid */}
      <div className="w-full max-w-sm mb-8">
        <div className="grid grid-cols-3 gap-3">
          {/* Row 1: 5/0, 10/0, 15/5 */}
          {TIMER_PRESETS.slice(0, 3).map((preset) => {
            const isActive = mode === preset.id;
            const glowColor = '#00FF66';

            return (
              <button
                key={preset.id}
                onClick={() => isIdle && handleSelectPreset(preset)}
                disabled={!isIdle}
                className={`relative p-3 rounded-xl text-xs font-medium transition-all border ${
                  isActive
                    ? 'border-transparent'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                } ${!isIdle && !isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${glowColor}15`,
                        borderColor: glowColor,
                        boxShadow: `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30, inset 0 0 15px ${glowColor}10`,
                        color: glowColor,
                      }
                    : {}
                }
              >
                <div className="font-bold">{`${preset.workMinutes}/${preset.breakMinutes}`}</div>
                <div className="text-[10px] opacity-80 truncate">{PRESET_LABELS[preset.id]}</div>
              </button>
            );
          })}

          {/* Row 2: 25/5, 50/10, 90/15 */}
          {TIMER_PRESETS.slice(3, 6).map((preset) => {
            const isActive = mode === preset.id;
            const glowColor = '#D000FF';

            return (
              <button
                key={preset.id}
                onClick={() => isIdle && handleSelectPreset(preset)}
                disabled={!isIdle}
                className={`relative p-3 rounded-xl text-xs font-medium transition-all border ${
                  isActive
                    ? 'border-transparent'
                    : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                } ${!isIdle && !isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${glowColor}15`,
                        borderColor: glowColor,
                        boxShadow: `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30, inset 0 0 15px ${glowColor}10`,
                        color: glowColor,
                      }
                    : {}
                }
              >
                <div className="font-bold">{`${preset.workMinutes}/${preset.breakMinutes}`}</div>
                <div className="text-[10px] opacity-80 truncate">{PRESET_LABELS[preset.id]}</div>
              </button>
            );
          })}

          {/* Row 3: Time Box - centered (spans 3 cols) */}
          <div className="col-span-3 flex justify-center">
            {(() => {
              const preset = TIMER_PRESETS[6]; // timebox
              const isActive = mode === preset.id;
              const glowColor = '#FFD700';

              return (
                <button
                  onClick={() => isIdle && handleSelectPreset(preset)}
                  disabled={!isIdle}
                  className={`relative p-3 rounded-xl text-xs font-medium transition-all border w-1/3 ${
                    isActive
                      ? 'border-transparent'
                      : 'border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:border-white/20'
                  } ${!isIdle && !isActive ? 'opacity-40 cursor-not-allowed' : ''}`}
                  style={
                    isActive
                      ? {
                          backgroundColor: `${glowColor}15`,
                          borderColor: glowColor,
                          boxShadow: `0 0 20px ${glowColor}60, 0 0 40px ${glowColor}30, inset 0 0 15px ${glowColor}10`,
                          color: glowColor,
                        }
                      : {}
                  }
                >
                  <div className="font-bold">Time Box</div>
                  <div className="text-[10px] opacity-80 truncate">{PRESET_LABELS[preset.id]}</div>
                </button>
              );
            })()}
          </div>
        </div>
      </div>

      {/* TimeBox Input */}
      {mode === 'timebox' && isIdle && (
        <div className="w-full max-w-sm mb-6 flex gap-2">
          <input
            type="time"
            value={timeBoxInput}
            onChange={(e) => setTimeBoxInput(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-[#0A0A0C] border border-white/10 text-white focus:border-[#FFD700] focus:outline-none text-center text-lg tracking-widest"
          />
          <button
            onClick={handleStartTimeBox}
            disabled={!timeBoxInput}
            className="px-6 py-3 rounded-xl bg-[#FFD700] text-black font-bold disabled:opacity-50 hover:shadow-[0_0_15px_#FFD70060] transition-all"
          >
            START
          </button>
        </div>
      )}

      {/* SVG Cyberpunk Progress Clock - Unified style for all modes */}
      <div className="relative mb-8">
        <svg width={radius * 2} height={radius * 2} className="transform -rotate-90">
          {/* Background circle - Deep purple (always dark, never bright) */}
          <circle
            stroke="#2D003B"
            strokeWidth={strokeWidth}
            fill="transparent"
            r={normalizedRadius}
            cx={radius}
            cy={radius}
          />
          {/* Progress arc - Only show when timer has value and is not idle 00:00 */}
          {(isRunning || isPaused || isBreak) && totalSeconds > 0 && (
            <circle
              stroke="#00FF66"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              fill="transparent"
              r={normalizedRadius}
              cx={radius}
              cy={radius}
              style={{
                strokeDasharray: `${circumference} ${circumference}`,
                strokeDashoffset: strokeDashoffset,
                transition: 'stroke-dashoffset 1s linear',
                filter: isRunning
                  ? 'drop-shadow(0 0 8px rgba(0,255,102,0.8))'
                  : 'none',
                opacity: isPaused ? 0.3 : 0.9,
              }}
            />
          )}
        </svg>

        {/* Clock text - Center (no blur background, clean digits) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-6xl font-bold tracking-wider font-mono ${clockTextClass} transition-all duration-500`}>
            {formatTime(timeLeft)}
          </div>
          <div className="mt-2 text-xs uppercase tracking-[0.2em]">
            {isRunning && <span className="text-[#00FF66] font-medium">SESJA PRACY</span>}
            {isPaused && <span className="text-[#7A0099] font-medium">PAUZA</span>}
            {isBreak && <span className="text-[#00F0FF] font-medium">PRZERWA</span>}
            {isIdle && !mode && <span className="text-white/30">GOTOWY</span>}
            {isIdle && mode && timeLeft === 0 && <span className="text-white/30">GOTOWY</span>}
          </div>
        </div>
      </div>

      {/* Control Buttons - Cyberpunk Style */}
      <div className="w-full max-w-sm flex flex-col items-center gap-3">
        {isIdle && !mode && (
          <p className="text-white/40 text-sm">Wybierz tryb, aby zacząć</p>
        )}

        {isIdle && mode && mode !== 'timebox' && (
          <button
            onClick={() => startTimer(mode)}
            className="w-full py-4 rounded-xl bg-[#D000FF] text-white font-bold text-lg border border-[#D000FF]/50 hover:shadow-[0_0_30px_#D000FF60] hover:border-[#D000FF] transition-all"
          >
            START
          </button>
        )}

        {(isRunning || isPaused) && (
          <button
            onClick={isRunning ? pauseTimer : resumeTimer}
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              isRunning
                ? 'bg-[#2D003B] text-white/90 border border-[#7A0099]/40 hover:bg-[#3D004B] hover:border-[#7A0099]/60'
                : 'bg-[#1a1a2e] text-[#00FF66] border-2 border-[#00FF66] shadow-[0_0_25px_rgba(0,255,102,0.4)] hover:shadow-[0_0_35px_rgba(0,255,102,0.6)] hover:bg-[#00FF66]/10'
            }`}
          >
            {isRunning ? 'PAUZA' : 'WZNÓW'}
          </button>
        )}

        {isBreak && (
          <button
            onClick={stopTimer}
            className="w-full py-4 rounded-xl bg-[#00F0FF]/15 text-[#00F0FF] font-bold text-lg border border-[#00F0FF]/40 hover:bg-[#00F0FF]/25 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all"
          >
            ZAKOŃCZ PRZERWĘ
          </button>
        )}

        {(isRunning || isPaused || isBreak) && (
          <button
            onClick={stopTimer}
            className="text-gray-500 hover:text-gray-300 text-sm bg-transparent border-none py-2 px-4 transition-colors"
          >
            Zakończ sesję
          </button>
        )}
      </div>

      {/* Completion Modal - 3-Way Cyberpunk Choice */}
      {showCompletionModal && (
        <div className="fixed inset-0 bg-black/95 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm p-8 rounded-2xl bg-[#0A0A0C] border border-white/10 shadow-[0_0_80px_rgba(208,0,255,0.15)]">
            <h3 className="text-3xl font-bold text-white mb-2 text-center tracking-wide">Czas minął!</h3>
            <p className="text-white/50 text-center mb-10">Co chcesz zrobić dalej?</p>
            <div className="flex flex-col gap-4">
              {/* Button 1: Complete Task - Neon Green */}
              <button
                onClick={handleCompleteTask}
                className="w-full py-4 rounded-xl bg-transparent border-2 border-[#00FF66] text-[#00FF66] font-bold text-lg hover:bg-[#00FF66]/10 hover:shadow-[0_0_30px_rgba(0,255,102,0.5)] transition-all duration-300"
              >
                Tak, ukończ zadanie
              </button>

              {/* Button 2: Another Session - Purple */}
              <button
                onClick={handleAnotherSession}
                className="w-full py-4 rounded-xl bg-transparent border-2 border-[#D000FF] text-[#D000FF] font-bold text-lg hover:bg-[#D000FF]/10 hover:shadow-[0_0_30px_rgba(208,0,255,0.5)] transition-all duration-300"
              >
                Chcę odbyć kolejną sesję
              </button>

              {/* Button 3: Return Later - Orange */}
              <button
                onClick={handleReturnLater}
                className="w-full py-4 rounded-xl bg-transparent border-2 border-[#FF8C00] text-[#FF8C00] font-bold text-lg hover:bg-[#FF8C00]/10 hover:shadow-[0_0_30px_rgba(255,140,0,0.5)] transition-all duration-300"
              >
                Nie, jeszcze do tego wrócę
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimerScreen;
