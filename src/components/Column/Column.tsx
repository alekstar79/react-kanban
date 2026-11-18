import { memo, useCallback, useMemo } from 'react';
import type { DragEvent } from 'react';
import type { Task, TaskStatus } from '../../types/task';
import { filterTasks } from '../../utils/taskFilters';
import doneIcon from '../../assets/icons/bxs_ghost.svg';
import inProgressIcon from '../../assets/icons/bxs_happy-alt.svg';
import reviewIcon from '../../assets/icons/bxs_upside-down.svg';
import todoIcon from '../../assets/icons/bxs_smile.svg';
import { TaskCard } from '../TaskCard/TaskCard';
import './Column.scss';

interface ColumnProps {
  status: TaskStatus;
  title: string;
  tasks: readonly Task[];
  searchQuery: string;
  now: Date;
  onDelete: (id: number) => void;
  onEdit: (id: number, changes: Pick<Task, 'text' | 'startDay' | 'endDay'>) => void;
  onMove: (id: number, newType: TaskStatus) => void;
}

const statusIcons: Record<TaskStatus, string> = {
  todo: todoIcon,
  in_progress: inProgressIcon,
  review: reviewIcon,
  done: doneIcon,
};

export const Column = memo(function Column({
  status,
  title,
  tasks,
  searchQuery,
  now,
  onDelete,
  onEdit,
  onMove,
}: ColumnProps) {
  const visibleTasks = useMemo(
    () => filterTasks(tasks, searchQuery),
    [tasks, searchQuery],
  );
  const handleDragOver = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
  }, []);
  const handleDrop = useCallback((event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    const id = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isInteger(id)) {
      onMove(id, status);
    }
  }, [onMove, status]);

  return (
    <section
      className={`kanban-column kanban-column--${status}`}
      aria-label={title}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h2>
        <img src={statusIcons[status]} alt="" />
        <span>{title}</span>
      </h2>
      <div className="kanban-column__cards">
        {visibleTasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            now={now}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </div>
    </section>
  );
});
