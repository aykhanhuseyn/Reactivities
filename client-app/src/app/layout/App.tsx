import React, { useState, useEffect } from 'react';
import { Container } from 'semantic-ui-react';
import IActivity from '../models/activity';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import agent from '../api/agent';

const App = () => {
  const [activities, setActivities] = useState<Array<IActivity>>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(
    null
  );
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [target, setTarget] = useState<string>('');

  const handleSelectActivity = (id: string) => {
    setSubmitting(true);
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
    setSubmitting(false);
  };
  const handleOpenCreateForm = () => {
    setSubmitting(true);
    setSelectedActivity(null);
    setEditMode(true);
    setSubmitting(false);
  };
  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.create(activity)
      .then(() => setActivities([...activities, activity]))
      .then(() => setSelectedActivity(activity))
      .then(() => setEditMode(false))
      .then(() => setSubmitting(false));
  };
  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    agent.Activities.update(activity)
      .then(() => {
        setActivities([
          ...activities.filter(elem => elem.id !== activity.id),
          activity
        ]);
        setEditMode(false);
      })
      .then(() => setSubmitting(false));
  };
  const handleDeleteActivity = (id: string, event: React.SyntheticEvent<HTMLButtonElement>) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    agent.Activities.delete(id)
      .then(() => {
        setActivities(activities.filter(elem => elem.id !== id));
      })
      .then(() => setSubmitting(false));
  };

  useEffect(() => {
    agent.Activities.list()
      .then(response => {
        const activities: Array<IActivity> = [];
        response.forEach(
          (activity: IActivity) =>
            (activity.date = activity.date.split('.')[0]) &&
            activities.push(activity)
        );
        setActivities(activities);
      })
      .then(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingComponent inverted={true} content="Loading activities..." />;
  }

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateForm} />
      <Container style={{ marginTop: '4rem' }}>
        <ActivityDashboard
          activities={activities}
          selectActivity={handleSelectActivity}
          selectedActivity={selectedActivity!}
          editMode={editMode}
          setEditMode={setEditMode}
          setSelectedActivity={setSelectedActivity}
          createActivity={handleCreateActivity}
          editActivity={handleEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
          target={target}
        />
      </Container>
    </>
  );
};

export default App;
