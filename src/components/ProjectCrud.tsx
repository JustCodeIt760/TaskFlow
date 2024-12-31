import React, { useState } from 'react';
import Modal from './common/Modal';
import CrudForm from './common/CrudForm';

interface ProjectCrudProps {
  // Add any specific props you need
}

const ProjectCrud: React.FC<ProjectCrudProps> = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCreate = () => {
    setMode('create');
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item: any) => {
    setMode('edit');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = (item: any) => {
    setMode('delete');
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (mode === 'create') {
        // API call to create
        console.log('Creating:', data);
      } else if (mode === 'edit') {
        // API call to update
        console.log('Updating:', data);
      } else if (mode === 'delete') {
        // API call to delete
        console.log('Deleting:', selectedItem);
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <button
        onClick={handleCreate}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Create New Project
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Project`}
      >
        <CrudForm
          mode={mode}
          entityType="project"
          initialData={selectedItem}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectCrud;
