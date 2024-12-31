import { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ProjectModals.css';

export function TaskFormModal({ type = 'create', task = null, projectId }) {
  const { closeModal } = useModal();
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [priority, setPriority] = useState(task?.priority || 'medium');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const taskData = {
      title,
      description,
      dueDate,
      priority,
      projectId
    };

    try {
      let response;
      if (type === 'create') {
        response = await fetch('/api/tasks', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
      } else if (type === 'update') {
        response = await fetch(`/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(taskData)
        });
      }

      if (response.ok) {
        closeModal();
      } else {
        const data = await response.json();
        setErrors(data.errors);
      }
    } catch (error) {
      setErrors({ general: 'An error occurred' });
    }
  };

  return (
    <div className="task-form-modal">
      <h2>{type === 'create' ? 'Create New Task' : 'Edit Task'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="dueDate">Due Date</label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
          {errors.dueDate && <span className="error">{errors.dueDate}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="priority">Priority</label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            required
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          {errors.priority && <span className="error">{errors.priority}</span>}
        </div>

        <div className="form-actions">
          <button type="submit">{type === 'create' ? 'Create Task' : 'Save Changes'}</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
