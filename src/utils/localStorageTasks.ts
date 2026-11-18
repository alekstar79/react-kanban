import type { Task } from '../types/task';
import { validateTasks } from './taskValidation';

export const TASKS_STORAGE_KEY = 'react-kanban.tasks';

export function loadTasks(storage: Storage, fallback: unknown): Task[] {
  try {
    const storedValue = storage.getItem(TASKS_STORAGE_KEY);

    if (storedValue !== null) {
      const parsed = JSON.parse(storedValue) as unknown;
      const storedTasks = validateTasks(parsed);

      if (storedTasks.length > 0 || Array.isArray(parsed) && parsed.length === 0) {
        return storedTasks;
      }
    }
  } catch {
    return validateTasks(fallback);
  }

  return validateTasks(fallback);
}

export function saveTasks(storage: Storage, tasks: readonly Task[]): void {
  try {
    storage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Persistence is optional; the in-memory state remains usable.
  }
}
