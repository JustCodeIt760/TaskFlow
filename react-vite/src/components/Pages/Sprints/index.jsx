import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { thunkLoadProjects } from '../../../redux/project';
import { thunkLoadSprints } from '../../../redux/sprint';
import { thunkLoadTasks } from '../../../redux/task';
import styles from './sprints.module.css';

function SprintCard({ sprint, projectName }) {
  const tasks = useSelector(state => state.tasks.allTasks);
  const sprintTasks = Object.values(tasks).filter(task => task.sprint_id === sprint.id);

  // Add console.log to debug sprint data
  console.log('Sprint in card:', sprint);
  console.log('Sprint tasks:', sprintTasks);

  return (
    <div className={styles.sprintCard}>
      <div className={styles.sprintHeader}>
        <div className={styles.sprintInfo}>
          <h3>{sprint.name}</h3>
          <p className={styles.projectName}>Project: {projectName}</p>
          <p className={styles.dates}>
            {new Date(sprint.start_date).toLocaleDateString()} - {new Date(sprint.end_date).toLocaleDateString()}
          </p>
        </div>
        <button className={styles.addTaskButton}>Add Task</button>
      </div>

      <div className={styles.timeline}>
        <div className={styles.timelineBar}></div>
      </div>

      <div className={styles.taskSection}>
        {sprintTasks.length > 0 ? (
          sprintTasks.map(task => (
            <div key={task.id} className={styles.taskItem}>
              <span>{task.title}</span>
            </div>
          ))
        ) : (
          <p className={styles.taskInfo}>
            No tasks in this sprint yet
          </p>
        )}
      </div>
    </div>
  );
}

function Sprints() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.session.user);
  const sprints = useSelector(state => state.sprints.allSprints);
  const projects = useSelector(state => state.projects.allProjects);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user) {
        setIsLoading(true);
        try {
          // First load projects
          const projectsResponse = await dispatch(thunkLoadProjects());

          if (projectsResponse) {
            // Once we have projects, load sprints for each project
            await Promise.all([
              ...Object.values(projectsResponse).map((project) =>
                dispatch(thunkLoadSprints(project.id))
              ),
              // Load tasks in parallel with sprints
              dispatch(thunkLoadTasks()),
            ]);
          }
        } catch (error) {
          console.error('Error loading sprints data:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    loadData();
  }, [dispatch, user]);

  // Get all sprints from projects the user is involved in
  const userSprints = Object.values(sprints).filter(sprint => {
    const project = projects[sprint.project_id];
    return project && (project.owner_id === user?.id || project.members?.includes(user?.id));
  });

  console.log('Filtered user sprints:', userSprints);
  console.log('All sprints:', sprints);
  console.log('All projects:', projects);

  if (isLoading) {
    return <div className={styles.loading}>Loading sprints...</div>;
  }

  return (
    <div className={styles.sprintsContainer}>
      <div className={styles.header}>
        <h1>Sprints</h1>
      </div>

      <div className={styles.sprintsGrid}>
        {userSprints.length > 0 ? (
          userSprints.map(sprint => (
            <SprintCard 
              key={sprint.id} 
              sprint={sprint} 
              projectName={projects[sprint.project_id]?.name || 'Unknown Project'}
            />
          ))
        ) : (
          <div className={styles.noSprints}>
            <p>No sprints found. Create a sprint in one of your projects to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Sprints;