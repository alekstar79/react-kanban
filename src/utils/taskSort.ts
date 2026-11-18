import type { Task } from '../types/task';

export function sortTasksByStartDay(tasks: readonly Task[]): Task[] {
  return [...tasks].sort((left, right) => left.startDay - right.startDay);
}
