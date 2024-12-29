import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadSprints } from '../../../redux/sprint';
import styles from './SprintCarousel.module.css';

const SprintCarousel = ({ projectId }) => {
  const dispatch = useDispatch();
  const sprints = useSelector(state => Object.values(state.sprints.allSprints));
  const [currentSprintIndex, setCurrentSprintIndex] = useState(0);

  useEffect(() => {
    dispatch(thunkLoadSprints(projectId));
  }, [dispatch, projectId]);

  const handlePrevSprint = () => {
    setCurrentSprintIndex(prev =>
      prev === 0 ? sprints.length - 1 : prev - 1
    );
  };

  const handleNextSprint = () => {
    setCurrentSprintIndex(prev =>
      prev === sprints.length - 1 ? 0 : prev + 1
    );
  };

  if (!sprints.length) {
    return (
      <div className={styles.noSprints}>
        <h2>No Sprints</h2>
        <p>Create a sprint to get started</p>
      </div>
    );
  }

  const currentSprint = sprints[currentSprintIndex];

  return (
    <div className={styles.sprintCarousel}>
      <div className={styles.carouselHeader}>
        <button onClick={handlePrevSprint}>&lt;</button>
        <h2>{currentSprint.name}</h2>
        <button onClick={handleNextSprint}>&gt;</button>
      </div>

      <div className={styles.sprintContent}>
        <div className={styles.sprintInfo}>
          <p>Start: {new Date(currentSprint.startDate).toLocaleDateString()}</p>
          <p>End: {new Date(currentSprint.endDate).toLocaleDateString()}</p>
        </div>

        <div className={styles.features}>
          <h3 className={styles.featuresHeader}>Sprint Features</h3>
          {currentSprint.features?.length > 0 ? (
            currentSprint.features.map(feature => (
              <div key={feature.id} className={styles.feature}>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
                <div className={styles.featureStatus}>
                  <span>Status: {feature.status}</span>
                  <span>Priority: {feature.priority}</span>
                </div>
              </div>
            ))
          ) : (
            <p className={styles.noFeatures}>No features assigned to this sprint</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SprintCarousel;
