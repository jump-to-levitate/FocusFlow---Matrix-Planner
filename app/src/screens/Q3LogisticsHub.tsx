import { useMemo, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLiveQuery } from 'dexie-react-hooks';
import { Phone, Mail, UserCheck, Zap, CheckCircle2 } from 'lucide-react';
import { db, type Task, type Q3ActionType } from '../db/dexie';

interface ActionMeta {
  capsule: string;
  color: string;
  icon: ReactNode;
}

const ACTION_META: Record<Q3ActionType, ActionMeta> = {
  batch_call:  { capsule: 'Seria Telefonów',  color: '#FF8C00', icon: <Phone className="w-4 h-4" /> },
  batch_email: { capsule: 'Szybkie Maile',    color: '#00E5FF', icon: <Mail className="w-4 h-4" /> },
  delegate:    { capsule: 'Do Oddelegowania', color: '#A78BFA', icon: <UserCheck className="w-4 h-4" /> },
  quick_fix:   { capsule: 'Pod 10 minut',     color: '#00FF66', icon: <Zap className="w-4 h-4" /> },
};

const ACTION_ORDER: readonly Q3ActionType[] = ['batch_call', 'batch_email', 'delegate', 'quick_fix'];

// Fallback klasyfikator słownikowy — używany gdy task.q3Action jest null/undefined.
const classifyByKeywords = (title: string): Q3ActionType => {
  const lower = title.toLowerCase();
  if (/\b(zadzwoń|zadzwon|telefon|tel|call|dzwoń|dzwon|rozmowa)\b/.test(lower)) return 'batch_call';
  if (/\b(mail|email|wyślij|wyslij|odpisz|odpowiedz|napisz)\b/.test(lower))     return 'batch_email';
  if (/\b(oddeleguj|deleguj|przekaż|przekaz|poproś|popros|zleć|zlec)\b/.test(lower)) return 'delegate';
  return 'quick_fix';
};

export const Q3LogisticsHub = () => {
  const navigate = useNavigate();
  const tasks = useLiveQuery(() => db.tasks.toArray(), []) ?? [];

  const q3Grouped = useMemo<Record<Q3ActionType, Task[]>>(() => {
    const groups: Record<Q3ActionType, Task[]> = {
      batch_call: [],
      batch_email: [],
      delegate: [],
      quick_fix: [],
    };
    for (const task of tasks) {
      if (task.quadrant !== 3 || task.completed) continue;
      const action: Q3ActionType = task.q3Action ?? classifyByKeywords(task.title);
      groups[action].push(task);
    }
    return groups;
  }, [tasks]);

  const totalActive =
    q3Grouped.batch_call.length +
    q3Grouped.batch_email.length +
    q3Grouped.delegate.length +
    q3Grouped.quick_fix.length;

  const handleComplete = (id: number) => {
    void db.tasks.update(id, { completed: true });
  };

  const handleDelegate = (id: number) => {
    const assignee = window.prompt('Komu delegujesz to zadanie?')?.trim();
    if (!assignee) return;
    void db.tasks.update(id, { completed: true, delegatedTo: assignee });
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0512] text-white flex flex-col justify-between font-sans selection:bg-[#FF8C00]/30">
      <header className="h-14 w-full border-b border-[#1F192F] px-4 flex items-center justify-between bg-[#0E081B]/80 backdrop-blur-md sticky top-0 z-50 shrink-0">
        <button
          onClick={() => navigate(-1)}
          className="text-[#9CA3AF] hover:text-white transition-colors text-sm flex items-center gap-1 whitespace-nowrap"
        >
          <span>←</span>
          <span className="whitespace-nowrap">Matryca</span>
        </button>
        <h1 className="text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-[#FF8C00] tracking-wide uppercase whitespace-nowrap">
          Hub Logistyki Q3
        </h1>
        <div className="w-8 h-8 shrink-0" aria-hidden="true" />
      </header>

      <main className="flex-1 px-3 py-4 overflow-y-auto space-y-3">
        {ACTION_ORDER.map(action => {
          const meta = ACTION_META[action];
          const list = q3Grouped[action];
          const isDelegate = action === 'delegate';

          return (
            <section
              key={action}
              data-action={action}
              className="bg-[#130B24] border border-[#1F192F] rounded-xl overflow-hidden flex flex-col min-w-0"
            >
              <div
                className="h-14 px-3 flex items-center justify-between border-b border-[#1F192F]/50 shrink-0"
                style={{ borderLeftColor: meta.color, borderLeftWidth: '3px' }}
              >
                <div className="flex items-center gap-2 overflow-hidden min-w-0">
                  <span style={{ color: meta.color }} className="shrink-0">{meta.icon}</span>
                  <span
                    className="font-semibold text-sm whitespace-nowrap truncate"
                    style={{ color: meta.color }}
                  >
                    {meta.capsule}
                  </span>
                </div>
                <span className="text-xs font-mono px-2 py-1 bg-[#1F192F] text-[#A78BFA] rounded-md border border-[#2A223F] shrink-0 whitespace-nowrap">
                  {list.length}
                </span>
              </div>

              <ul className="p-2 space-y-1">
                {list.length === 0 ? (
                  <li className="p-2 text-[#6B7280] text-xs italic text-center">
                    Brak zadań w tej kapsule
                  </li>
                ) : (
                  list.map(task => (
                    <li
                      key={task.id}
                      className="flex items-center gap-2 p-2 bg-[#1A0F30]/50 hover:bg-[#1A0F30] rounded-lg transition-colors min-w-0"
                    >
                      <span className="flex-1 text-xs text-[#E8D5FF] truncate min-w-0">
                        {task.title}
                      </span>
                      {isDelegate ? (
                        <button
                          onClick={() => task.id != null && handleDelegate(task.id)}
                          className="shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded border whitespace-nowrap transition-colors"
                          style={{
                            color: meta.color,
                            borderColor: `${meta.color}66`,
                            backgroundColor: `${meta.color}1A`,
                          }}
                          aria-label="Oddeleguj zadanie"
                        >
                          Deleguj
                        </button>
                      ) : (
                        <button
                          onClick={() => task.id != null && handleComplete(task.id)}
                          className="shrink-0 transition-transform hover:scale-110"
                          style={{ color: meta.color }}
                          aria-label="Oznacz jako wykonane"
                        >
                          <CheckCircle2 className="w-5 h-5" />
                        </button>
                      )}
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}

        <div className="p-3 bg-[#130B24] border border-[#1F192F] rounded-xl">
          <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
            <span className="whitespace-nowrap">Aktywne zadania Q3:</span>
            <span className="font-mono font-bold text-white whitespace-nowrap">
              {totalActive}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
};
