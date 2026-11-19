import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { sortTasksByStartDay } from '../../src/utils/taskSort';

describe('sortTasksByStartDay', () => {
  it('sorts in ascending order without mutating the source', () => {
    const tasks: Task[] = [
      { id: 1, type: 'todo', startDay: 30, endDay: 40, text: 'Later' },
      { id: 2, type: 'todo', startDay: 10, endDay: 20, text: 'Earlier' },
    ];

    expect(sortTasksByStartDay(tasks).map((task) => task.id)).toEqual([2, 1]);
    expect(tasks.map((task) => task.id)).toEqual([1, 2]);
  });
});
