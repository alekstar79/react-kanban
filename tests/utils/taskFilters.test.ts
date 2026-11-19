import { describe, expect, it } from 'vitest';
import type { Task } from '../../src/types/task';
import { filterTasks } from '../../src/utils/taskFilters';

const tasks: Task[] = [
  {
    id: 1,
    type: 'todo',
    startDay: Date.UTC(2024, 0, 19),
    endDay: Date.UTC(2024, 0, 30),
    text: 'Сделать тестовое для IP',
  },
  {
    id: 2,
    type: 'done',
    startDay: Date.UTC(2024, 1, 1),
    endDay: Date.UTC(2024, 1, 2),
    text: 'Закрыть отчет',
  },
  {
    id: 3,
    type: 'review',
    startDay: Date.UTC(2023, 11, 19),
    endDay: Date.UTC(2023, 11, 20),
    text: 'Обновить сведения',
  },
  {
    id: 4,
    type: 'todo',
    startDay: Date.UTC(2024, 11, 19),
    endDay: Date.UTC(2024, 11, 21),
    text: 'Подготовить релиз',
  },
  {
    id: 5,
    type: 'todo',
    startDay: Date.UTC(2024, 1, 5),
    endDay: Date.UTC(2024, 1, 6),
    text: 'Выпустить версию 19',
  },
];

describe('filterTasks', () => {
  it('filters by text regardless of case', () => {
    expect(filterTasks(tasks, 'ТЕСТОВОЕ')).toEqual([tasks[0]]);
  });

  it('filters by exact startDay or endDay date', () => {
    expect(filterTasks(tasks, '30.01.2024')).toEqual([tasks[0]]);
  });

  it('matches incremental date fragments and text simultaneously', () => {
    expect(filterTasks(tasks, '19')).toEqual([tasks[0], tasks[2], tasks[3], tasks[4]]);
    expect(filterTasks(tasks, '19.12')).toEqual([tasks[2], tasks[3]]);
  });

  it('matches a complete date only on the corresponding date string', () => {
    expect(filterTasks(tasks, '19.12.2024')).toEqual([tasks[3]]);
  });

  it('returns all tasks for an empty query', () => {
    expect(filterTasks(tasks, '  ')).toEqual(tasks);
  });
});
