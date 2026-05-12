export interface ModalState {
  kind: 'idle' | 'modal:Q2' | 'modal:Q3' | 'modal:Q4' | 'overload';
  data?: unknown;
}
