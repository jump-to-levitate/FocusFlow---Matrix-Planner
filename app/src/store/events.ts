export const TASK_UPDATED_EVENT = 'TaskUpdated';
const CHANNEL_NAME = 'FocusFlowSync';

type Handler = () => void;
const handlers = new Set<Handler>();

let channel: BroadcastChannel | null = null;
let windowBound = false;

function ensureBindings(): void {
  if (typeof window === 'undefined') return;
  if (!windowBound) {
    window.addEventListener(TASK_UPDATED_EVENT, () => {
      handlers.forEach((h) => h());
    });
    windowBound = true;
  }
  if (channel === null && typeof window.BroadcastChannel !== 'undefined') {
    channel = new BroadcastChannel(CHANNEL_NAME);
    channel.onmessage = (ev: MessageEvent) => {
      if (ev.data === TASK_UPDATED_EVENT) {
        handlers.forEach((h) => h());
      }
    };
  }
}

export function emitTaskUpdated(): void {
  if (typeof window === 'undefined') return;
  ensureBindings();
  window.dispatchEvent(new CustomEvent(TASK_UPDATED_EVENT));
  if (channel) channel.postMessage(TASK_UPDATED_EVENT);
}

export function subscribeTaskUpdated(handler: Handler): () => void {
  if (typeof window === 'undefined') return () => {};
  ensureBindings();
  handlers.add(handler);
  return () => {
    handlers.delete(handler);
  };
}
