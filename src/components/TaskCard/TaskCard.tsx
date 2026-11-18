import { memo, useCallback, useState } from 'react';
import type { DragEvent } from 'react';
import type { Task } from '../../types/task';
import { formatTimestamp } from '../../utils/dateFormat';
import { isOverdue } from '../../utils/overdue';
import { parseDDMMYYYY } from '../../utils/date';
import checkIcon from '../../assets/icons/check.svg';
import crossIcon from '../../assets/icons/cross.svg';
import editIcon from '../../assets/icons/edit.svg';
import trashIcon from '../../assets/icons/trash.svg';
import './TaskCard.scss';

interface TaskCardProps {
  task: Task;
  now: Date;
  onDelete: (id: number) => void;
  onEdit: (id: number, changes: Pick<Task, 'text' | 'startDay' | 'endDay'>) => void;
}

export const TaskCard = memo(function TaskCard({ task, now, onDelete, onEdit }: TaskCardProps) {
  const isEditable = task.type === 'todo';
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(task.text);
  const [startDay, setStartDay] = useState(formatTimestamp(task.startDay));
  const [endDay, setEndDay] = useState(formatTimestamp(task.endDay));
  const [editError, setEditError] = useState('');

  const handleCancel = useCallback(() => {
    setText(task.text);
    setStartDay(formatTimestamp(task.startDay));
    setEndDay(formatTimestamp(task.endDay));
    setEditError('');
    setIsEditing(false);
  }, [task.endDay, task.startDay, task.text]);

  const handleSave = useCallback(() => {
    const parsedStartDay = parseDDMMYYYY(startDay);
    const parsedEndDay = parseDDMMYYYY(endDay);

    if (!text.trim() || parsedStartDay === null || parsedEndDay === null) {
      setEditError('Введите описание и даты в формате dd.mm.yyyy');
      return;
    }

    onEdit(task.id, {
      text: text.trim(),
      startDay: parsedStartDay,
      endDay: parsedEndDay,
    });
    setEditError('');
    setIsEditing(false);
  }, [endDay, onEdit, startDay, task.id, text]);
  const handleStartEdit = useCallback(() => setIsEditing(true), []);
  const handleDelete = useCallback(() => onDelete(task.id), [onDelete, task.id]);
  const handleDragStart = useCallback((event: DragEvent<HTMLElement>) => {
    event.dataTransfer.setData('text/plain', String(task.id));
    event.dataTransfer.effectAllowed = 'move';
  }, [task.id]);

  return (
    <article
      className={`task-card${isOverdue(task, now) ? ' task-card--overdue' : ''}`}
      tabIndex={0}
      draggable={!isEditing}
      onDragStart={handleDragStart}
    >
      {isEditing && isEditable ? (
        <div className="task-card__edit">
          <label>
            Начало:
            <input value={startDay} onChange={(event) => setStartDay(event.target.value)} />
          </label>
          <label>
            Окончание:
            <input value={endDay} onChange={(event) => setEndDay(event.target.value)} />
          </label>
          <label>
            Описание:
            <input value={text} onChange={(event) => setText(event.target.value)} />
          </label>
          {editError && <span role="alert">{editError}</span>}
          <div className="task-card__edit-actions">
            <button type="button" onClick={handleCancel} aria-label="Отменить редактирование">
              <img src={crossIcon} alt="" />
            </button>
            <button type="button" onClick={handleSave} aria-label="Сохранить задачу">
              <img src={checkIcon} alt="" />
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="task-card__field">
            <span className="task-card__label">Начало:</span>
            <strong className="task-card__date">{formatTimestamp(task.startDay)}</strong>
          </div>
          <div className="task-card__field">
            <span className="task-card__label">Окончание:</span>
            <strong className="task-card__date">{formatTimestamp(task.endDay)}</strong>
          </div>
          <div className="task-card__field">
            <span className="task-card__label">Описание:</span>
            <strong className="task-card__description">{task.text}</strong>
          </div>
          <div className="task-card__actions">
            {isEditable && (
              <button
                type="button"
                className="task-card__edit-button"
                aria-label={`Редактировать задачу ${task.id}`}
                onClick={handleStartEdit}
              >
                <img src={editIcon} alt="" />
              </button>
            )}
            <button
              type="button"
              className="task-card__delete"
              aria-label={`Удалить задачу ${task.id}`}
              onClick={handleDelete}
            >
              <img src={trashIcon} alt="" />
            </button>
          </div>
        </>
      )}
    </article>
  );
});
