import React, { useState } from 'react';
import Modal from '../common/Modal';
import CrudForm from '../common/CrudForm';

interface FeatureCrudProps {
  projectId: number;
  availableUsers: Array<{ id: number; name: string }>;
  onFeatureChange?: () => void;
}

const FeatureCrud: React.FC<FeatureCrudProps> = ({
  projectId,
  availableUsers,
  onFeatureChange
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mode, setMode] = useState<'create' | 'edit' | 'delete'>('create');
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const handleSubmit = async (data: any) => {
    try {
      // Add your API calls here
      if (mode === 'create') {
        // API call to create feature
      } else if (mode === 'edit') {
        // API call to update feature
      } else if (mode === 'delete') {
        // API call to delete feature
      }

      setIsModalOpen(false);
      onFeatureChange?.();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <button
        onClick={() => {
          setMode('create');
          setSelectedFeature(null);
          setIsModalOpen(true);
        }}
        className="px-4 py-2 bg-indigo-600 text-white rounded-md"
      >
        Add Feature
      </button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`${mode.charAt(0).toUpperCase() + mode.slice(1)} Feature`}
      >
        <CrudForm
          mode={mode}
          entityType="feature"
          initialData={selectedFeature}
          projectId={projectId}
          availableUsers={availableUsers}
          onSubmit={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
        />
      </Modal>
    </>
  );
};

export default FeatureCrud;
