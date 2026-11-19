import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Task } from '../../../src/types/task';
import { TaskCard } from '../../../src/components/TaskCard/TaskCard';

const task: Task = {
  id: 1,
  type: 'todo',
  startDay: Date.UTC(2024, 0, 19),
  endDay: Date.UTC(2024, 0, 30),
  text: 'Сделать тестовое',
};

describe('TaskCard', () => {
  it('keeps delete control mounted and deletes the selected task', () => {
    const onDelete = vi.fn();
    render(
      <TaskCard
        task={task}
        now={new Date('2025-01-10T00:00:00Z')}
        onDelete={onDelete}
        onEdit={vi.fn()}
      />,
    );

    const card = screen.getByText('Сделать тестовое').closest('article');
    expect(card).not.toBeNull();
    const deleteButton = card?.querySelector<HTMLButtonElement>('[aria-label="Удалить задачу 1"]');
    expect(deleteButton).not.toBeNull();

    fireEvent.mouseEnter(card as HTMLElement);
    fireEvent.click(deleteButton as HTMLButtonElement);

    expect(onDelete).toHaveBeenCalledWith(1);
  });

  it('keeps overdue styling independent from hover without marking the deadline text', () => {
    const overdueTask = {
      ...task,
      endDay: Date.UTC(2024, 0, 30),
    };
    render(
      <TaskCard
        task={overdueTask}
        now={new Date('2025-01-10T00:00:00Z')}
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />,
    );

    const card = screen.getByText('Сделать тестовое').closest('article');
    expect(card).toHaveClass('task-card--overdue');
    expect(screen.getByText('30.01.2024')).not.toHaveClass('task-card__deadline--overdue');

    fireEvent.mouseEnter(card as HTMLElement);

    expect(card).toHaveClass('task-card--overdue');
    expect(screen.getByText('30.01.2024')).not.toHaveClass('task-card__deadline--overdue');
  });
});
