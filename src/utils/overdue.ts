import type { Task } from '../types/task';

const calendarFormatter = new Intl.DateTimeFormat('en-US', {
  calendar: 'gregory',
  day: '2-digit',
  month: '2-digit',
  numberingSystem: 'latn',
  year: 'numeric',
});

function getCalendarDay(date: Date): number {
  const parts = calendarFormatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')!.value);
  const month = Number(parts.find((part) => part.type === 'month')!.value);
  const day = Number(parts.find((part) => part.type === 'day')!.value);
  return year * 10_000 + month * 100 + day;
}

/**
 * Compares endDay with today in the browser's local calendar.
 * Calendar components make DST day length irrelevant; done tasks are never overdue.
 *
 * @param {Task} task
 * @param {Date=} now Current instant, injectable for deterministic calls and tests.
 */
export function isOverdue(task: Task, now: Date = new Date()): boolean {
  if (task.type === 'done') {
    return false;
  }

  const deadline = new Date(task.endDay);

  if (!Number.isFinite(deadline.getTime())) {
    return false;
  }

  return getCalendarDay(deadline) < getCalendarDay(now);
}
