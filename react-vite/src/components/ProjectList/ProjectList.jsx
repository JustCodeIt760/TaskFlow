import { useModal } from '../../context/Modal';
import { ProjectFormModal } from '../ProjectModals/ProjectFormModal';
import { DeleteConfirmationModal } from '../ProjectModals/DeleteConfirmationModal';

export function ProjectList() {
  const { setModalContent } = useModal();

  const openCreateProjectModal = () => {
    setModalContent(<ProjectFormModal type="create" />);
  };

  const openEditProjectModal = (project) => {
    setModalContent(<ProjectFormModal type="update" project={project} />);
  };

  const openDeleteProjectModal = (project) => {
    setModalContent(
      <DeleteConfirmationModal
        itemType="project"
        itemId={project.id}
        itemName={project.title}
        onDelete={() => {
          // Handle refresh of project list
        }}
      />
    );
  };

  return (
    <div className="project-list">
      <button onClick={openCreateProjectModal}>Create New Project</button>

      {/* Project list rendering */}
      {projects.map(project => (
        <div key={project.id} className="project-card">
          <h3>{project.title}</h3>
          <div className="project-actions">
            <button onClick={() => openEditProjectModal(project)}>Edit</button>
            <button onClick={() => openDeleteProjectModal(project)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
