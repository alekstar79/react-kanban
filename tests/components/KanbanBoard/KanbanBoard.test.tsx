import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { Task, TaskStatus } from '../../../src/types/task';
import { KanbanBoard } from '../../../src/components/KanbanBoard/KanbanBoard';

const statuses: TaskStatus[] = ['todo', 'in_progress', 'review', 'done'];
const tasks: Task[] = statuses.map((type, index) => ({
  id: index + 1,
  type,
  startDay: Date.UTC(2025, 0, index + 1),
  endDay: Date.UTC(2025, 0, index + 10),
  text: `Task ${type}`,
}));

function renderBoard() {
  return render(
    <KanbanBoard
      tasks={tasks}
      searchQuery=""
      now={new Date('2025-01-01T00:00:00.000Z')}
      onDelete={vi.fn()}
      onEdit={vi.fn()}
      onMove={vi.fn()}
    />,
  );
}

describe('KanbanBoard card states', () => {
  it('keeps To Do edit/trash controls in the DOM and reveals them on hover', () => {
    renderBoard();

    const todoColumn = screen.getByRole('region', { name: 'To Do' });
    const todoCard = within(todoColumn).getByText('Task todo').closest('article');
    expect(todoCard).not.toBeNull();
    const editButton = todoCard?.querySelector<HTMLButtonElement>('[aria-label="Редактировать задачу 1"]');
    const deleteButton = todoCard?.querySelector<HTMLButtonElement>('[aria-label="Удалить задачу 1"]');
    expect(editButton).not.toBeNull();
    expect(deleteButton).not.toBeNull();
    expect(editButton?.querySelector('img')).toHaveAttribute('src', expect.stringContaining('edit.svg'));

    fireEvent.mouseEnter(todoCard as HTMLElement);

    expect(todoCard?.querySelectorAll('.task-card__actions button')).toHaveLength(2);
  });

  it.each([
    { title: 'In Progress', id: 2, status: 'in_progress' },
    { title: 'Review', id: 3, status: 'review' },
    { title: 'Done', id: 4, status: 'done' },
  ])('does not allow editing in $title, and only shows trash on hover', ({ title, id, status }) => {
    renderBoard();

    const column = screen.getByRole('region', { name: title });
    const card = within(column).getByText(`Task ${status}`).closest('article');
    expect(card).not.toBeNull();
    expect(within(column).queryByRole('button', { name: /Редактировать/ })).not.toBeInTheDocument();
    const deleteButton = card?.querySelector<HTMLButtonElement>(`[aria-label="Удалить задачу ${id}"]`);
    expect(deleteButton).not.toBeNull();
    expect(card?.querySelector('[aria-label^="Редактировать задачу"]')).toBeNull();

    fireEvent.mouseEnter(card as HTMLElement);

    expect(card?.querySelectorAll('.task-card__actions button')).toHaveLength(1);
  });

  it('shows cancel and save controls while editing a To Do card', () => {
    renderBoard();
    const todoColumn = screen.getByRole('region', { name: 'To Do' });

    fireEvent.click(within(todoColumn).getByRole('button', { name: 'Редактировать задачу 1' }));

    expect(within(todoColumn).getByRole('button', { name: 'Отменить редактирование' })).toBeInTheDocument();
    expect(within(todoColumn).getByRole('button', { name: 'Сохранить задачу' })).toBeInTheDocument();
  });
});
