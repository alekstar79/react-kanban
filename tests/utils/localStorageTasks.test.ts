import { beforeEach, describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { loadTasks, saveTasks, TASKS_STORAGE_KEY } from '../../src/utils/localStorageTasks';

const fallback: Task[] = [
  { id: 1, type: 'todo', startDay: 10, endDay: 20, text: 'Fallback task' },
];

describe('loadTasks', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads validated tasks from localStorage', () => {
    const stored: Task[] = [
      { id: 2, type: 'done', startDay: 30, endDay: 40, text: 'Stored task' },
    ];
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(stored));

    expect(loadTasks(localStorage, fallback)).toEqual(stored);
  });

  it('uses fallback for missing or invalid localStorage', () => {
    expect(loadTasks(localStorage, fallback)).toEqual(fallback);
    localStorage.setItem(TASKS_STORAGE_KEY, '{invalid');
    expect(loadTasks(localStorage, fallback)).toEqual(fallback);
  });

  it('preserves a valid empty task array', () => {
    localStorage.setItem(TASKS_STORAGE_KEY, '[]');

    expect(loadTasks(localStorage, fallback)).toEqual([]);
  });

  it('writes the current task state', () => {
    const updated: Task[] = [
      { id: 3, type: 'review', startDay: 50, endDay: 60, text: 'Updated task' },
    ];

    saveTasks(localStorage, updated);

    expect(loadTasks(localStorage, fallback)).toEqual(updated);
  });
});
