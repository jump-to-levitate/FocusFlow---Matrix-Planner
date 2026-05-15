// ============================================================================
// FocusFlow 2.0 - Matrix Screen (Macierz Eisenhowera)
// 2×2 grid with 4 quadrants
// PDF Reference: str. 16
// ============================================================================

import { QuadrantCard } from '../components/QuadrantCard';

export const MatrixScreen = () => {
  return (
    <div className="content-area">
      {/* Header */}
      <header className="mb-5">
        <h1 className="text-2xl font-black text-white uppercase tracking-wide mb-1">Macierz</h1>
        <p className="text-sm text-white/50 font-medium">Eisenhower Matrix 2×2</p>
      </header>

      {/* Matrix Grid 2×2 */}
      <div className="grid grid-cols-2 gap-3">
        {/* Q1 - Urgent & Important (Fire) */}
        <QuadrantCard
          quadrant={1}
          title="Pilne i Ważne"
          subtitle="Rób teraz"
          color="lime"
        />

        {/* Q2 - Not Urgent & Important (Growth) */}
        <QuadrantCard
          quadrant={2}
          title="Niepilne i Ważne"
          subtitle="Zaplanuj"
          color="purple"
        />

        {/* Q3 - Urgent & Not Important (Admin) */}
        <QuadrantCard
          quadrant={3}
          title="Pilne i Nieważne"
          subtitle="Deleguj"
          color="orange"
        />

        {/* Q4 - Not Urgent & Not Important (Waste) */}
        <QuadrantCard
          quadrant={4}
          title="Niepilne i Nieważne"
          subtitle="Eliminuj"
          color="slate"
        />
      </div>
    </div>
  );
};

export default MatrixScreen;
