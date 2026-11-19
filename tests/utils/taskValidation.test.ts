import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { isTask, validateTasks } from '../../src/utils/taskValidation';

const validTask: Task = {
  id: 1,
  type: 'todo',
  startDay: 1700000000000,
  endDay: 1700500000000,
  text: 'Valid task',
};

describe('Task validation', () => {
  it('accepts a valid task', () => {
    expect(isTask(validTask)).toBe(true);
  });

  it('rejects invalid status and timestamps', () => {
    expect(isTask({ ...validTask, type: 'unknown' })).toBe(false);
    expect(isTask({ ...validTask, startDay: Number.NaN })).toBe(false);
  });

  it('filters a mixed array and keeps valid tasks only', () => {
    expect(validateTasks([validTask, null, { ...validTask, id: 0 }])).toEqual([validTask]);
  });

  it('returns an empty array for a non-array value', () => {
    expect(validateTasks({ tasks: [validTask] })).toEqual([]);
  });
});
