import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { moveTask } from '../../src/utils/moveTask';
import { sortTasksByStartDay } from '../../src/utils/taskSort';

describe('moveTask', () => {
  it('changes type immutably and sorts the moved task by startDay in its new column', () => {
    const tasks: Task[] = [
      { id: 1, type: 'todo', startDay: 20, endDay: 30, text: 'Moved task' },
      { id: 2, type: 'review', startDay: 10, endDay: 25, text: 'Earlier task' },
      { id: 3, type: 'review', startDay: 30, endDay: 40, text: 'Later task' },
    ];

    const moved = moveTask(tasks, 1, 'review');
    const sortedReviewTasks = sortTasksByStartDay(
      moved.filter((task) => task.type === 'review'),
    );

    expect(moved[0].type).toBe('review');
    expect(sortedReviewTasks.map((task) => task.id)).toEqual([2, 1, 3]);
    expect(tasks[0].type).toBe('todo');
  });
});
