import { FC, useState } from 'react';
import { Quadrant, Task, ContextAction } from '../types';
import { useTasksStore } from '../store/useTasksStore';
import { selectOpen, selectByQuadrant } from '../store/selectors';
import TaskCard from '../components/TaskCard';
import ContextMenu from '../components/ContextMenu';
import { CONTAINER, GLOW, QUADRANT_COLOR, QUADRANT_LABEL, colors } from '../constants/colors';

export const Pulpit: FC = () => {
  const store = useTasksStore();
  const open = selectOpen(store.tasks);
  const heroTask = selectByQuadrant(open, 'I')[0] ?? null;
  const [menuTask, setMenuTask] = useState<Task | null>(null);

  const handleAction = async (task: Task, action: ContextAction) => {
    if (action === 'done') {
      await store.updateTask(task.id, { isDone: true, completedAt: new Date().toISOString() });
    } else if (action === 'delete') {
      await store.removeTask(task.id);
    } else if (action === 'startFocus') {
      await store.startFocusSession(task.id, '25/5');
      window.location.hash = `#timer?taskId=${task.id}&mode=25/5`;
    }
  };

  const startHero = async () => {
    if (!heroTask) return;
    await store.startFocusSession(heroTask.id, '25/5');
    window.location.hash = `#timer?taskId=${heroTask.id}&mode=25/5`;
  };

  return (
    <div className={CONTAINER}>
      {heroTask && (
        <section
          className="rounded-card p-4 border-2 bg-panel"
          style={{ borderColor: colors.neonRed, boxShadow: GLOW.ring(colors.neonRed) }}
        >
          <p className="text-[10px] font-black uppercase tracking-qlabel text-neonRed mb-2">Hero &mdash; Twoj Q1 #1</p>
          <h2 className="text-white text-xl font-black mb-3">{heroTask.title}</h2>
          <button
            onClick={startHero}
            className="w-full py-3 rounded-pill font-black uppercase tracking-qlabel text-midnight bg-neonGreen"
            style={{ boxShadow: GLOW.hero(colors.neonGreen) }}
          >
            START FOCUS
          </button>
        </section>
      )}

      <h2 className="text-white text-2xl font-black uppercase tracking-qlabel">Macierz Eisenhowera</h2>
      <div className="grid grid-cols-2 gap-3">
        {(['I', 'II', 'III', 'IV'] as Quadrant[]).map(q => {
          const items = selectByQuadrant(open, q).slice(0, 5);
          const color = QUADRANT_COLOR[q];
          return (
            <div
              key={q}
              className="rounded-card p-3 border-2 bg-slate800 min-h-[160px]"
              style={{ borderColor: color, boxShadow: GLOW.soft(color) }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-qlabel" style={{ color }}>
                  Q{q} &mdash; {QUADRANT_LABEL[q]}
                </span>
                <span className="text-xs font-bold text-white">{items.length}</span>
              </div>
              <ul className="space-y-1">
                {items.map(t => (
                  <li key={t.id}>
                    <TaskCard
                      task={t}
                      variant="matrix"
                      onAction={(a) => {
                        if (a === 'openMenu') setMenuTask(t);
                        else void handleAction(t, a);
                      }}
                    />
                  </li>
                ))}
                {items.length === 0 && <li className="text-[11px] text-textSecondary">brak zadan</li>}
              </ul>
            </div>
          );
        })}
      </div>

      {menuTask && (
        <ContextMenu
          task={menuTask}
          onClose={() => setMenuTask(null)}
          onAction={(a) => void handleAction(menuTask, a)}
        />
      )}
    </div>
  );
};

export default Pulpit;
