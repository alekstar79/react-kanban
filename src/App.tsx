import { useCallback, useEffect, useMemo, useState } from 'react';
import fallbackTasks from './data/tasks.json';
import { KanbanBoard } from './components/KanbanBoard/KanbanBoard';
import { SearchBar } from './components/SearchBar/SearchBar';
import { loadTasks, saveTasks } from './utils/localStorageTasks';
import { moveTask } from './utils/moveTask';
import type { Task, TaskStatus } from './types/task';
import './App.scss';

export function App() {
  const [tasks, setTasks] = useState(() => loadTasks(localStorage, fallbackTasks));
  const [searchQuery, setSearchQuery] = useState('');
  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    saveTasks(localStorage, tasks);
  }, [tasks]);

  const handleDelete = useCallback((id: number) => {
    setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
  }, []);

  const handleEdit = useCallback((
    id: number,
    changes: Pick<Task, 'text' | 'startDay' | 'endDay'>,
  ) => {
    setTasks((currentTasks) => currentTasks.map((task) => (
      task.id === id ? { ...task, ...changes } : task
    )));
  }, []);

  const handleMove = useCallback((id: number, newType: TaskStatus) => {
    setTasks((currentTasks) => moveTask(currentTasks, id, newType));
  }, []);

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Your tasks</h1>
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </header>
      <KanbanBoard
        tasks={tasks}
        searchQuery={searchQuery}
        now={now}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onMove={handleMove}
      />
    </main>
  );
}
