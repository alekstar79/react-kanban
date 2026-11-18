import type { Task, TaskStatus } from '../types/task';

export function moveTask(tasks: readonly Task[], id: number, newType: TaskStatus): Task[] {
  return tasks.map((task) => (
    task.id === id
      ? { ...task, type: newType }
      : task
  ));
}
