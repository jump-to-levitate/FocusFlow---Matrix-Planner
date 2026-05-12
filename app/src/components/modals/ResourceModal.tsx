import { FC, useState } from 'react';
import { X, Link as LinkIcon, File as FileIcon } from 'lucide-react';
import { Resource, FileRecord } from '../../types';
import { saveFile } from '../../db';
import { GLOW, colors } from '../../constants/colors';

type Tab = 'link' | 'file';

interface ResourceModalProps {
  taskId: string;
  onClose: () => void;
  onConfirm: (resource: Resource) => void;
}

const blobFromFile = (file: File): Promise<Blob> => Promise.resolve(file);

export const ResourceModal: FC<ResourceModalProps> = ({ taskId, onClose, onConfirm }) => {
  const [tab, setTab] = useState<Tab>('link');
  const [linkValue, setLinkValue] = useState('');
  const [linkLabel, setLinkLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onAddLink = () => {
    if (!linkValue.trim()) { setError('Wpisz URL'); return; }
    try {
      const u = new URL(linkValue.trim());
      const res: Resource = {
        id: crypto.randomUUID(),
        type: 'link',
        label: linkLabel.trim() || u.hostname,
        value: u.toString(),
        createdAt: new Date().toISOString(),
      };
      onConfirm(res);
      onClose();
    } catch {
      setError('Niepoprawny URL');
    }
  };

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const blob = await blobFromFile(file);
      const rec: FileRecord = {
        id: crypto.randomUUID(),
        taskId,
        name: file.name,
        type: file.type || 'application/octet-stream',
        size: file.size,
        data: '', // Will be filled when actually saving to IndexedDB
        blob,
        createdAt: Date.now(),
      };
      await saveFile(rec);
      const res: Resource = {
        id: rec.id,
        type: 'file',
        label: file.name,
        value: rec.id,
        createdAt: new Date(rec.createdAt).toISOString(),
      };
      onConfirm(res);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Blad zapisu pliku');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 animate-in fade-in duration-200">
      <div
        className="w-full max-w-md rounded-t-card sm:rounded-card p-5 m-0 sm:m-4 bg-panel border border-panelBorder animate-in slide-in-from-bottom-4 duration-200"
        style={{ boxShadow: GLOW.ring(colors.neonPurple) }}
      >
        <header className="flex items-center justify-between mb-4">
          <h3 className="text-white text-lg font-extrabold uppercase tracking-qlabel">Dodaj zasob</h3>
          <button onClick={onClose} className="text-textSecondary hover:text-white"><X size={20} /></button>
        </header>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => setTab('link')}
            className={`flex-1 py-2 rounded-pill text-[10px] font-bold uppercase tracking-qlabel flex items-center justify-center gap-2 ${tab === 'link' ? 'bg-neonPurple text-white' : 'bg-slate800 text-textSecondary'}`}
          ><LinkIcon size={14} /> Link</button>
          <button
            onClick={() => setTab('file')}
            className={`flex-1 py-2 rounded-pill text-[10px] font-bold uppercase tracking-qlabel flex items-center justify-center gap-2 ${tab === 'file' ? 'bg-neonPurple text-white' : 'bg-slate800 text-textSecondary'}`}
          ><FileIcon size={14} /> Plik</button>
        </div>

        {tab === 'link' ? (
          <div className="space-y-3">
            <input
              type="text"
              value={linkLabel}
              onChange={(e) => setLinkLabel(e.target.value)}
              placeholder="Etykieta (opcjonalna)"
              className="w-full rounded-card p-3 bg-slate900 text-white border border-panelBorder focus:outline-none focus:border-neonPurple"
            />
            <input
              type="url"
              value={linkValue}
              onChange={(e) => { setLinkValue(e.target.value); setError(null); }}
              placeholder="https://..."
              className="w-full rounded-card p-3 bg-slate900 text-white border border-panelBorder focus:outline-none focus:border-neonPurple"
            />
            {error && <p className="text-q1 text-xs">{error}</p>}
            <button
              onClick={onAddLink}
              className="w-full py-3 rounded-pill font-extrabold uppercase tracking-qlabel bg-neonPurple text-white"
              style={{ boxShadow: GLOW.ring(colors.neonPurple) }}
            >Dodaj</button>
          </div>
        ) : (
          <div className="space-y-3">
            <label className="block w-full rounded-card border-2 border-dashed border-neonPurple p-6 text-center cursor-pointer">
              <input
                type="file"
                className="hidden"
                disabled={busy}
                onChange={(e) => void onFile(e.target.files?.[0] ?? undefined)}
              />
              <span className="text-textSecondary text-sm">
                {busy ? 'Zapisuje...' : 'Kliknij aby wybrac plik'}
              </span>
            </label>
            {error && <p className="text-q1 text-xs">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceModal;
