import React, { useEffect, useContext } from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from '../../features/nav/NavBar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import LoadingComponent from './LoadingComponent';
import ActivityStore from '../stores/activityStore';
import { observer } from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) {
    return <LoadingComponent inverted={true} content="Loading activities..." />;
  }

  return (
    <>
      <NavBar />
      <Container style={{ marginTop: '4rem' }}>
        <ActivityDashboard />
      </Container>
    </>
  );
};

export default observer(App);
