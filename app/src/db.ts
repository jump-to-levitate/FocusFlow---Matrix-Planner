import { openDB, IDBPDatabase } from 'idb';
import { Task } from './types';
import type { FileRecord } from './types';

export async function initDB(): Promise<IDBPDatabase> {
  return openDB('FocusFlowDB', 2, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
        const store = db.createObjectStore('tasks', { keyPath: 'id' });
        store.createIndex('byQuadrant', 'quadrant');
        store.createIndex('byCategory', 'category');
        store.createIndex('byDone', 'isDone');
      }
      if (oldVersion < 2) {
        if (!db.objectStoreNames.contains('appState')) {
          db.createObjectStore('appState', { keyPath: 'key' });
        }
      }
    },
  });
}

export async function saveTask(
  db: IDBPDatabase,
  task: Task
): Promise<void> {
  await db.put('tasks', task);
}

export async function deleteTask(
  db: IDBPDatabase,
  id: string
): Promise<void> {
  await db.delete('tasks', id);
}

export async function getAllTasks(
  db: IDBPDatabase
): Promise<Task[]> {
  return db.getAll('tasks') as Promise<Task[]>;
}

export async function saveAppState(key: string, value: unknown): Promise<void> {
  const db = await initDB();
  await db.put('appState', { key, value } as { key: string; value: unknown });
}

export async function getAppState(key: string): Promise<unknown | null> {
  const db = await initDB();
  const record = await db.get('appState', key);
  return record ? (record as { key: string; value: unknown }).value : null;
}

export async function clearTasks(): Promise<void> {
  const db = await initDB();
  await db.clear('tasks');
}

export async function clearAppState(): Promise<void> {
  const db = await initDB();
  await db.clear('appState');
}

// Not yet implemented — placeholder for file attachments (S5)
export async function saveFile(_file: FileRecord): Promise<void> {
  // TODO: implement file storage in IndexedDB
}

export async function deleteFile(_id: string): Promise<void> {
  // TODO: implement file deletion from IndexedDB
}
