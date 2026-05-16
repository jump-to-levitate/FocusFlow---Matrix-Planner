import Dexie, { type Table } from 'dexie';

export interface Task {
  id?: number;
  title: string;
  quadrant: 1 | 2 | 3 | 4;
  completed: boolean;
  createdAt: Date;
}

export class FocusFlowDB extends Dexie {
  tasks!: Table<Task>;

  constructor() {
    super('FocusFlowDB');
    this.version(2).stores({
      tasks: '++id, quadrant, completed, createdAt',
    });
  }
}

export const db = new FocusFlowDB();
