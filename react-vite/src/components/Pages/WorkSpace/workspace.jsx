import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { refreshAllData } from '../../../redux/shared';
import { useModal } from '../../../context/Modal';
import { selectEnrichedProjects } from '../../../redux/project';
import ProjectFormModal from '../../../context/ProjectFormModal';
import styles from './Workspace.module.css';


function ProjectCard({ project }) {
  return (
    <NavLink to={`/projects/${project.id}`} className={styles.projectLink}>
      <div className={styles.projectCard}>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className={styles.projectStats}>
          <div>
            <span>
              Current Sprint:{' '}
              {project.stats.currentSprint?.name || 'No active sprint'}
            </span>
          </div>
          <div className={styles.taskStats}>
            <span>Total Tasks: {project.stats.totalTasks || 0}</span>
            <span className={styles.overdue}>
              Overdue: {project.stats.overdueTasks || 0}
            </span>
          </div>
          <div>
            <div className={styles.progressBar}>
              <div
                className={styles.progress}
                style={{
                  width: `${project.display.percentComplete}%`,
                }}
              />
            </div>
            <div className={styles.progressPercent}>
              {Math.round(project.display.percentComplete)}% Complete
            </div>
            <div className={styles.progressText}>
              Due {project.display.dueDate}
            </div>
          </div>
        </div>
      </div>
    </NavLink>
  );
}

function Workspace() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { openModal } = useModal();
  const user = useSelector((state) => state.session.user);
  const { owned, shared } = useSelector(selectEnrichedProjects);

  const handleCreateProject = () => {
    openModal(<ProjectFormModal type="create" project={null} />);
  };

  useEffect(() => {
    if (user) {
      dispatch(refreshAllData());
    }
  }, [dispatch, user]);

  return (
    <div className={styles.workspaceContainer}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1>Workspace</h1>
        </div>
        <button className={styles.createButton} onClick={handleCreateProject}>
          Create a Project
        </button>
      </div>

      <div className={styles.projectsSection}>
        <h2 className={styles.sectionHeader}>Owned Projects</h2>
        <div className={styles.projectsGrid}>
          {owned.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        <h2 className={styles.sectionHeader}>Shared Projects</h2>
        <div className={styles.projectsGrid}>
          {shared.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Workspace;
