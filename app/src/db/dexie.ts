import Dexie, { type Table } from 'dexie';

export type Q2Subcategory = 'rutyna' | 'projekt' | 'ogolny_cel' | 'inne';

export interface Task {
  id?: number;
  title: string;
  quadrant: 0 | 1 | 2 | 3 | 4; // 0 = Inbox Note (unassigned)
  completed: boolean;
  createdAt: Date;
  subcategory?: string | null; // Podkategoria: 'rutyna', 'projekt', 'zrob_teraz', 'rozrywka' itp.
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
