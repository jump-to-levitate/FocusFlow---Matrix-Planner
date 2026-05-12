

interface ModalQ4Props {
  title: string;
  onClose: () => void;
  onConfirm: (data: unknown) => void;
}

export default function ModalQ4({ title, onClose, onConfirm }: ModalQ4Props) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">{title} — Deleguj/Usuń (Q4)</h2>
        <p className="mb-4">Czy na pewno chcesz usunąć lub delegować to zadanie?</p>
        <div className="flex gap-2">
          <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => onConfirm({})}>Potwierdź</button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}
