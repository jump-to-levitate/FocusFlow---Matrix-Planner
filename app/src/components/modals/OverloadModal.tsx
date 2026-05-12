interface OverloadModalProps {
  q1Count: number;
  onAction: (action: { kind: 'retry' | 'planQ2' | 'saveAsNote' }) => void;
}

export default function OverloadModal({ q1Count, onAction }: OverloadModalProps) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Przeciążenie Q1</h2>
        <p className="mb-4">Masz już {q1Count} zadań w quadrant I. To zadanie można przenieść do II.</p>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onAction({ kind: 'planQ2' })}>Planuj (Q2)</button>
          <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={() => onAction({ kind: 'saveAsNote' })}>Zapisz jako notatkę</button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={() => onAction({ kind: 'retry' })}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}