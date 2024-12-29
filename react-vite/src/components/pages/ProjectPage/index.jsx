import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { thunkSetProject } from '../../../redux/project';
import FeatureList from '../../features/FeatureList';
import SprintCarousel from '../../sprints/SprintCarousel';
import styles from './ProjectPage.module.css';

const ProjectPage = () => {
  const { projectId } = useParams();
  const dispatch = useDispatch();
  const project = useSelector(state => state.projects.singleProject);
  const isLoading = useSelector(state => state.projects.isLoading);

  useEffect(() => {
    dispatch(thunkSetProject(projectId));
  }, [dispatch, projectId]);

  if (isLoading) return <div>Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className={styles.projectPage}>
      <div className={styles.contentArea}>
        <header className={styles.projectHeader}>
          <h1>{project.name}</h1>
        </header>

        <main className={styles.mainContent}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.parkingLotHeader}>Parking Lot</h2>
            <FeatureList projectId={projectId} />
          </div>
        </main>
      </div>

      <div className={styles.sprintSection}>
        <SprintCarousel projectId={projectId} />
      </div>
    </div>
  );
};

export default ProjectPage;