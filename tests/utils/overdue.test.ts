// DST changes elapsed day length, not the calendar components compared here.
import { describe, expect, it, vi } from 'vitest';
import type { Task } from '../../src/types/task';
import { isOverdue } from '../../src/utils/overdue';

const now = new Date(2025, 0, 10, 12);

function createTask(overrides: Partial<Task> = {}): Task {
  return {
    id: 1,
    type: 'todo',
    startDay: new Date(2025, 0, 10).getTime(),
    endDay: new Date(2025, 0, 10).getTime(),
    text: 'Test task',
    ...overrides,
  };
}

describe('isOverdue', () => {
  it('returns true for a past deadline on a non-done task', () => {
    expect(isOverdue(createTask({
      endDay: new Date(2025, 0, 9, 23, 59, 59, 999).getTime(),
    }), now)).toBe(true);
  });

  it('returns false for a future deadline', () => {
    expect(isOverdue(createTask({
      endDay: new Date(2025, 0, 11).getTime(),
    }), now)).toBe(false);
  });

  it('returns false for a done task with a past deadline', () => {
    expect(isOverdue(createTask({
      type: 'done',
      endDay: new Date(2025, 0, 9).getTime(),
    }), now)).toBe(false);
  });

  it('does not mark a deadline at the start of today as overdue', () => {
    const todayStart = new Date(2025, 0, 10).getTime();

    expect(isOverdue(createTask({ endDay: todayStart }), now)).toBe(false);
  });

  it('marks a deadline one millisecond before today as overdue', () => {
    const todayStart = new Date(2025, 0, 10).getTime();

    expect(isOverdue(createTask({ endDay: todayStart - 1 }), now)).toBe(true);
  });

  it('does not mark a task overdue when startDay and endDay are today', () => {
    const sameDay = new Date(2025, 0, 10).getTime();

    expect(isOverdue(createTask({
      startDay: sameDay,
      endDay: sameDay,
    }), now)).toBe(false);
  });

  it('returns false for a timestamp outside the JavaScript Date range', () => {
    expect(isOverdue(createTask({
      endDay: Number.MAX_SAFE_INTEGER,
    }), now)).toBe(false);
  });

  it('does not mutate the task', () => {
    const task = createTask({
      endDay: new Date(2025, 0, 9).getTime(),
    });
    const originalTask = { ...task };

    expect(isOverdue(task, now)).toBe(true);
    expect(task).toEqual(originalTask);
  });

  it('uses the injected system clock when now is omitted', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2025, 0, 10, 12));

    try {
      expect(isOverdue(createTask({
        endDay: new Date(2025, 0, 7, 12).getTime(),
      }))).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});
