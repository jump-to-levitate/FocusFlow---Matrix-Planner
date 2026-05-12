import { useState } from 'react';

interface ModalQ2Props {
  title: string;
  onClose: () => void;
  onConfirm: (data: { plan: string }) => void;
}

export default function ModalQ2({ title, onClose, onConfirm }: ModalQ2Props) {
  const [plan, setPlan] = useState('');
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{title} — Plan (Q2)</h2>
        <textarea
          className="w-full border p-2 mb-4"
          rows={4}
          value={plan}
          onChange={e => setPlan(e.target.value)}
          placeholder="Opisz plan..."
        />
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onConfirm({ plan })}>Potwierdź</button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}
