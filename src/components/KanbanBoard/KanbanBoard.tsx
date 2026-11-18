import { useEffect, useMemo, useRef } from 'react';
import type { Task, TaskStatus } from '../../types/task';
import { sortTasksByStartDay } from '../../utils/taskSort';
import { Column } from '../Column/Column';
import './KanbanBoard.scss';

interface KanbanBoardProps {
  tasks: readonly Task[];
  searchQuery: string;
  now: Date;
  onDelete: (id: number) => void;
  onEdit: (id: number, changes: Pick<Task, 'text' | 'startDay' | 'endDay'>) => void;
  onMove: (id: number, newType: TaskStatus) => void;
}

const columns: readonly { status: TaskStatus; title: string }[] = [
  { status: 'todo', title: 'To Do' },
  { status: 'in_progress', title: 'In Progress' },
  { status: 'review', title: 'Review' },
  { status: 'done', title: 'Done' },
];

export function KanbanBoard({
  tasks,
  searchQuery,
  now,
  onDelete,
  onEdit,
  onMove,
}: KanbanBoardProps) {
  const previousTasksByStatus = useRef<Record<TaskStatus, readonly Task[]>>({
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  });
  const sortedTasks = useMemo(() => sortTasksByStartDay(tasks), [tasks]);
  const tasksByStatus = useMemo(() => {
    const nextTasksByStatus: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      review: [],
      done: [],
    };

    sortedTasks.forEach((task) => nextTasksByStatus[task.type].push(task));

    const stableTasksByStatus: Record<TaskStatus, readonly Task[]> = {
      todo: nextTasksByStatus.todo,
      in_progress: nextTasksByStatus.in_progress,
      review: nextTasksByStatus.review,
      done: nextTasksByStatus.done,
    };

    columns.forEach(({ status }) => {
      const previousTasks = previousTasksByStatus.current[status];
      const nextTasks = nextTasksByStatus[status];
      const isUnchanged = previousTasks.length === nextTasks.length
        && previousTasks.every((task, index) => task === nextTasks[index]);

      if (isUnchanged) {
        stableTasksByStatus[status] = previousTasks;
      }
    });

    return stableTasksByStatus;
  }, [sortedTasks]);

  useEffect(() => {
    previousTasksByStatus.current = tasksByStatus;
  }, [tasksByStatus]);

  return (
    <div className="kanban-board-viewport">
      <div className="kanban-board">
        {columns.map(({ status, title }) => (
          <Column
            key={status}
            status={status}
            title={title}
            tasks={tasksByStatus[status]}
            searchQuery={searchQuery}
            now={now}
            onDelete={onDelete}
            onEdit={onEdit}
            onMove={onMove}
          />
        ))}
      </div>
    </div>
  );
}
