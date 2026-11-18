import type { Task, TaskStatus } from '../types/task';

const taskStatuses: readonly TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];

export function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && taskStatuses.includes(value as TaskStatus);
}

export function isValidTimestamp(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0;
}

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof candidate.id === 'number'
    && Number.isInteger(candidate.id)
    && candidate.id > 0
    && isTaskStatus(candidate.type)
    && isValidTimestamp(candidate.startDay)
    && isValidTimestamp(candidate.endDay)
    && typeof candidate.text === 'string'
    && candidate.text.trim().length > 0
  );
}

export function validateTasks(value: unknown): Task[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter(isTask);
}
