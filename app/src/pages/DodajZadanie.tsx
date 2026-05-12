import { FC, useState } from 'react';
import { Quadrant, Task } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { CONTAINER, GLOW, colors } from '../constants/colors';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const TIME_REGEX = /^([01]\d|2[0-3]):[0-5]\d$|^AllDay$/;

const fieldLabel = 'text-[10px] uppercase font-black tracking-qlabel text-textSecondary';
const fieldInput = 'mt-1 w-full rounded-card p-3 bg-slate900 text-white border border-panelBorder focus:outline-none focus:border-neonGreen';

export const DodajZadanie: FC = () => {
  const store = useTasksStore();
  const [title, setTitle] = useState('');
  const [quadrant, setQuadrant] = useState<Quadrant>('I');
  const [category, setCategory] = useState('Inne');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [recurringDays, setRecurringDays] = useState<string[]>([]);
  const [autoEscalate, setAutoEscalate] = useState(false);
  const [escalateDaysBefore, setEscalateDaysBefore] = useState(2);
  const [timeError, setTimeError] = useState<string | null>(null);

  const toggleDay = (d: string) => {
    setRecurringDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d]);
  };

  const onSubmit = async () => {
    if (!title.trim()) return;
    if (scheduledTime && !TIME_REGEX.test(scheduledTime)) {
      setTimeError('Format: HH:MM lub AllDay');
      return;
    }
    setTimeError(null);
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      description: '',
      quadrant,
      category,
      isImportant: quadrant === 'I' || quadrant === 'II',
      isUrgent: quadrant === 'I' || quadrant === 'III',
      strategy: null,
      terminType: null,
      scheduledDate: scheduledDate || null,
      scheduledTime: scheduledTime || null,
      recurringDays,
      microSteps: [],
      resources: [],
      noteContent: '',
      autoEscalate,
      escalateDaysBefore,
      isDone: false,
      isRejected: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      sessionsCount: 0,
    };
    await store.addTask(task);
    window.location.hash = '#pulpit';
  };

  const canSubmit = title.trim().length > 0;

  return (
    <div className={`${CONTAINER} max-w-lg mx-auto`}>
      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Dodaj zadanie</h2>

      <label className="block">
        <span className={fieldLabel}>Tytul</span>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className={fieldInput}
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={fieldLabel}>Quadrant</span>
          <select
            value={quadrant}
            onChange={e => setQuadrant(e.target.value as Quadrant)}
            className={fieldInput}
          >
            <option value="I">Q1 - Pilne i wazne</option>
            <option value="II">Q2 - Wazne, niepilne</option>
            <option value="III">Q3 - Pilne, niewazne</option>
            <option value="IV">Q4 - Niepilne, niewazne</option>
          </select>
        </label>

        <label className="block">
          <span className={fieldLabel}>Kategoria</span>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className={fieldInput}
          >
            <option value="Inne">Inne</option>
            <option value="Habit">Habit</option>
            <option value="WielkiProjekt">Wielki Projekt</option>
            <option value="Notatka">Notatka</option>
          </select>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <label className="block">
          <span className={fieldLabel}>Data</span>
          <input
            type="date"
            value={scheduledDate}
            onChange={e => setScheduledDate(e.target.value)}
            className={fieldInput}
          />
        </label>
        <label className="block">
          <span className={fieldLabel}>Czas (HH:MM lub AllDay)</span>
          <input
            type="text"
            value={scheduledTime}
            onChange={e => setScheduledTime(e.target.value)}
            placeholder="09:30"
            className={`${fieldInput} ${timeError ? 'border-neonRed' : ''}`}
          />
          {timeError && <span className="text-[11px] text-neonRed">{timeError}</span>}
        </label>
      </div>

      <div>
        <span className={fieldLabel}>Dni powtarzania</span>
        <div className="flex flex-wrap gap-2 mt-2">
          {DAYS.map(d => {
            const active = recurringDays.includes(d);
            return (
              <button
                key={d}
                type="button"
                onClick={() => toggleDay(d)}
                className={`px-3 py-1.5 rounded-pill text-[10px] uppercase font-black tracking-qlabel ${active ? 'bg-neonGreen text-midnight' : 'bg-slate800 text-white'}`}
              >{d}</button>
            );
          })}
        </div>
      </div>

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={autoEscalate}
          onChange={e => setAutoEscalate(e.target.checked)}
        />
        <span className="text-sm text-white">Auto-eskalacja do Q1</span>
      </label>

      {autoEscalate && (
        <label className="block">
          <span className={fieldLabel}>Dni przed deadline</span>
          <input
            type="number"
            value={escalateDaysBefore}
            min={0}
            onChange={e => setEscalateDaysBefore(Number(e.target.value))}
            className={fieldInput}
          />
        </label>
      )}

      <button
        onClick={onSubmit}
        disabled={!canSubmit}
        className="w-full py-3 rounded-pill font-black uppercase tracking-qlabel disabled:opacity-40 bg-neonGreen text-midnight"
        style={canSubmit ? { boxShadow: GLOW.hero(colors.neonGreen) } : undefined}
      >Dodaj</button>
    </div>
  );
};

export default DodajZadanie;
