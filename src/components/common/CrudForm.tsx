import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

// Enum for status options
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export enum FeatureStatus {
  PLANNED = 'PLANNED',
  IN_DEVELOPMENT = 'IN_DEVELOPMENT',
  TESTING = 'TESTING',
  COMPLETED = 'COMPLETED'
}

interface Field {
  name: string;
  type: string;
  label: string;
  required?: boolean;
  options?: { value: string | number; label: string }[];
  dependent?: {
    field: string;
    type: 'enable' | 'disable' | 'show' | 'hide';
    value: any;
  };
}

interface CrudFormProps {
  mode: 'create' | 'edit' | 'delete';
  entityType: 'project' | 'task' | 'feature' | 'sprint';
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
  projectId?: number; // For creating features/tasks within a project
  sprintId?: number; // For creating features/tasks within a sprint
  availableUsers?: Array<{ id: number; name: string }>; // For user assignment
}

const FIELD_CONFIGS: Record<string, Field[]> = {
  project: [
    {
      name: 'name',
      type: 'text',
      label: 'Project Name',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description'
    },
    {
      name: 'owner_id',
      type: 'select',
      label: 'Project Owner',
      required: true
    },
    {
      name: 'due_date',
      type: 'datetime-local',
      label: 'Due Date',
      required: true
    }
  ],

  feature: [
    {
      name: 'name',
      type: 'text',
      label: 'Feature Name',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description'
    },
    {
      name: 'project_id',
      type: 'hidden',
      label: 'Project ID',
      required: true
    },
    {
      name: 'sprint_id',
      type: 'select',
      label: 'Sprint',
      required: false
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { value: FeatureStatus.PLANNED, label: 'Planned' },
        { value: FeatureStatus.IN_DEVELOPMENT, label: 'In Development' },
        { value: FeatureStatus.TESTING, label: 'Testing' },
        { value: FeatureStatus.COMPLETED, label: 'Completed' }
      ]
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      options: [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' }
      ]
    }
  ],

  task: [
    {
      name: 'name',
      type: 'text',
      label: 'Task Name',
      required: true
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description'
    },
    {
      name: 'feature_id',
      type: 'select',
      label: 'Feature',
      required: true
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      options: [
        { value: TaskStatus.TODO, label: 'To Do' },
        { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
        { value: TaskStatus.DONE, label: 'Done' }
      ]
    },
    {
      name: 'priority',
      type: 'select',
      label: 'Priority',
      required: true,
      options: [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' }
      ]
    },
    {
      name: 'assigned_to',
      type: 'select',
      label: 'Assigned To'
    },
    {
      name: '_start_date',
      type: 'datetime-local',
      label: 'Start Date'
    },
    {
      name: '_due_date',
      type: 'datetime-local',
      label: 'Due Date'
    }
  ],

  sprint: [
    {
      name: 'name',
      type: 'text',
      label: 'Sprint Name',
      required: true
    },
    {
      name: 'project_id',
      type: 'hidden',
      label: 'Project ID',
      required: true
    },
    {
      name: '_start_date',
      type: 'datetime-local',
      label: 'Start Date',
      required: true
    },
    {
      name: '_end_date',
      type: 'datetime-local',
      label: 'End Date',
      required: true
    }
  ]
};

const CrudForm: React.FC<CrudFormProps> = ({
  mode,
  entityType,
  initialData,
  onSubmit,
  onCancel,
  projectId,
  sprintId,
  availableUsers
}) => {
  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: {
      ...initialData,
      project_id: projectId,
      sprint_id: sprintId
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  const fields = FIELD_CONFIGS[entityType].map(field => {
    // Handle dynamic options for user assignments
    if (field.name === 'assigned_to' || field.name === 'owner_id') {
      return {
        ...field,
        options: availableUsers?.map(user => ({
          value: user.id,
          label: user.name
        }))
      };
    }
    return field;
  });

  const renderField = (field: Field) => {
    const commonProps = {
      ...register(field.name, { required: field.required }),
      className: `mt-1 block w-full rounded-md border-gray-300 shadow-sm
                 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`,
      id: field.name,
    };

    // Handle hidden fields
    if (field.type === 'hidden') {
      return <input type="hidden" {...commonProps} />;
    }

    switch (field.type) {
      case 'textarea':
        return <textarea {...commonProps} rows={3} />;

      case 'select':
        return (
          <select {...commonProps}>
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'datetime-local':
        return <input {...commonProps} type="datetime-local" />;

      default:
        return <input {...commonProps} type={field.type} />;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {fields
        .filter(field => field.type !== 'hidden')
        .map(field => (
          <div key={field.name}>
            <label
              htmlFor={field.name}
              className="block text-sm font-medium text-gray-700"
            >
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </label>
            {renderField(field)}
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {field.label} is required
              </p>
            )}
          </div>
        ))}

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm
                   text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 border border-transparent rounded-md shadow-sm
                   text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          {mode === 'create' ? 'Create' : mode === 'edit' ? 'Update' : 'Delete'}
        </button>
      </div>
    </form>
  );
};

export default CrudForm;
