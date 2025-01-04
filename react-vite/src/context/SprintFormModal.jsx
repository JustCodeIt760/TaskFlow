import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  thunkAddSprint,
  thunkLoadSprints,
  thunkRemoveSprint,
  thunkUpdateSprint,
} from '../redux/sprint';
import { useModal } from './Modal';

const SprintFormModal = ({
  type = 'create',
  sprint = null,
  projectId = null,
}) => {
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  const projects = useSelector(state => state.projects?.allProjects || {});
  const currentSprints = useSelector(state => state.sprints?.allSprints || {});

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState(projectId || '');
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [errors, setErrors] = useState({});

  // Use useEffect to update form fields when sprint prop changes
  useEffect(() => {
    if (sprint && sprint.id) {
      // Get the latest sprint data from the store
      const currentSprint = currentSprints[sprint.id];
      if (currentSprint) {
        setName(currentSprint.name || '');
        setDescription(currentSprint.description || '');
        setSelectedProjectId(currentSprint.project_id || projectId || '');

        // Format the dates properly
        const formattedStartDate = currentSprint.start_date
          ? new Date(currentSprint.start_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];
        const formattedEndDate = currentSprint.end_date
          ? new Date(currentSprint.end_date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0];

        setStartDate(formattedStartDate);
        setEndDate(formattedEndDate);
      }
    }
  }, [sprint, projectId, currentSprints]);

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({});

    if (!name.trim()) {
      setErrors(prev => ({ ...prev, name: 'Sprint name is required' }));
      return;
    }

    if (!description.trim()) {
      setErrors(prev => ({ ...prev, description: 'Description is required' }));
      return;
    }

    if (!selectedProjectId) {
      setErrors(prev => ({
        ...prev,
        project_id: 'Project selection is required',
      }));
      return;
    }

    const sprintData = {
      name: name.trim(),
      description: description.trim(),
      project_id: Number(selectedProjectId),
      start_date: startDate,
      end_date: endDate,
      id: sprint?.id,
    };

    try {
      let result;
      if (type === 'create') {
        result = await dispatch(
          thunkAddSprint(Number(selectedProjectId), sprintData)
        );
      } else if (type === 'update') {
        result = await dispatch(
          thunkUpdateSprint(Number(selectedProjectId), sprintData)
        );
      }

      if (result?.errors) {
        setErrors(result.errors);
      } else {
        // Refresh sprints data
        await dispatch(thunkLoadSprints(Number(selectedProjectId)));
        closeModal();
      }
    } catch (error) {
      setErrors({ general: 'An error occurred' });
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this sprint? This action cannot be undone.'
    );

    if (confirmDelete && sprint?.id) {
      try {
        const result = await dispatch(
          thunkRemoveSprint(selectedProjectId, sprint.id)
        );
        if (result?.errors) {
          setErrors({ delete: result.errors });
        } else if (result) {
          await dispatch(thunkLoadSprints(selectedProjectId));
          closeModal();
        } else {
          setErrors({ delete: 'Failed to delete sprint' });
        }
      } catch (error) {
        setErrors({ delete: 'An error occurred while deleting the sprint' });
      }
    }
  };

  return (
    <div className="sprint-form-modal">
      <h2>{type === 'create' ? 'Create New Sprint' : 'Edit Sprint'}</h2>
      {errors.general && <div className="error-message">{errors.general}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="project_id">Project</label>
          <select
            id="project_id"
            value={selectedProjectId}
            onChange={e => setSelectedProjectId(e.target.value)}
            required
            disabled={Boolean(projectId)}
          >
            <option value="">Select a project</option>
            {Object.values(projects).map(project => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {errors.project_id && (
            <span className="error">{errors.project_id}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="name">Sprint Name</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          {errors.name && <span className="error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          {errors.description && (
            <span className="error">{errors.description}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            id="start_date"
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            required
          />
          {errors.start_date && (
            <span className="error">{errors.start_date}</span>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="end_date">End Date</label>
          <input
            id="end_date"
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            required
          />
          {errors.end_date && <span className="error">{errors.end_date}</span>}
        </div>

        <div className="form-actions">
          <button type="submit">
            {type === 'create' ? 'Create Sprint' : 'Save Changes'}
          </button>
          <button type="button" onClick={closeModal}>
            Cancel
          </button>
          {type === 'update' && (
            <button
              type="button"
              onClick={handleDelete}
              className="delete-button"
            >
              Delete Sprint
            </button>
          )}
        </div>
        {errors.delete && <div className="error-message">{errors.delete}</div>}
      </form>
    </div>
  );
};

export default SprintFormModal;
