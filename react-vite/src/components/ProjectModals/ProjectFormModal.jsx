import { useState } from 'react';
import { useModal } from '../../context/Modal';
import './ProjectModals.css';

export function ProjectFormModal({ type = 'create', project = null }) {
  const { closeModal } = useModal();
  const [title, setTitle] = useState(project?.title || '');
  const [description, setDescription] = useState(project?.description || '');
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const projectData = {
      title,
      description,
      // Add other relevant fields
    };

    try {
      let response;
      if (type === 'create') {
        response = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      } else if (type === 'update') {
        response = await fetch(`/api/projects/${project.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(projectData)
        });
      }

      if (response.ok) {
        closeModal();
        // You might want to trigger a refresh of the projects list here
      } else {
        const data = await response.json();
        setErrors(data.errors);
      }
    } catch (error) {
      setErrors({ general: 'An error occurred' });
    }
  };

  return (
    <div className="project-form-modal">
      <h2>{type === 'create' ? 'Create New Project' : 'Edit Project'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Project Title</label>
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

        <div className="form-actions">
          <button type="submit">{type === 'create' ? 'Create Project' : 'Save Changes'}</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
