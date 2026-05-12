import type { FC } from 'react';
import ModalQ2 from '../modals/ModalQ2';
import ModalQ3 from '../modals/ModalQ3';
import ModalQ4 from '../modals/ModalQ4';
import OverloadModal from '../modals/OverloadModal';
import type { StrategicData } from '../../logic/brainDumpPipeline';
import type { ModalState } from './FlowState';

interface StrategicModalsProps {
  flow: ModalState;
  title: string;
  q1Count: number;
  onClose: () => void;
  onStrategicConfirm: (data: StrategicData) => void;
  onOverloadAction: (action: { kind: 'retry' | 'planQ2' | 'saveAsNote' }) => void;
}

export const StrategicModals: FC<StrategicModalsProps> = ({
  flow, title, q1Count, onClose, onStrategicConfirm, onOverloadAction,
}) => (
  <>
    {flow.kind === 'modal:Q2' && (
      <ModalQ2 title={title} onClose={onClose} onConfirm={(d: { plan: string }) => onStrategicConfirm({ quadrant: 'II', plan: d.plan })} />
    )}
    {flow.kind === 'modal:Q3' && (
      <ModalQ3 title={title} onClose={onClose} onConfirm={(d: { strategy: string }) => onStrategicConfirm({ quadrant: 'III', strategy: d.strategy })} />
    )}
    {flow.kind === 'modal:Q4' && (
      <ModalQ4 title={title} onClose={onClose} onConfirm={(d: unknown) => onStrategicConfirm({ quadrant: 'IV', action: d })} />
    )}
    {flow.kind === 'overload' && (
      <OverloadModal q1Count={q1Count} onAction={onOverloadAction} />
    )}
  </>
);