import type { Task } from '../types/task';
import { formatTimestamp } from './dateFormat';

export function filterTasks(tasks: readonly Task[], query: string): Task[] {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return [...tasks];
  }

  return tasks.filter((task) => (
    task.text.toLowerCase().includes(normalizedQuery)
    || formatTimestamp(task.startDay).includes(normalizedQuery)
    || formatTimestamp(task.endDay).includes(normalizedQuery)
  ));
}
