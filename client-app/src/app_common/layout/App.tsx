import React, { Fragment, useEffect, useState } from "react";
import { Container } from "semantic-ui-react";

// ui model
import { Activity } from "../models/activity";

// components
import NavBar from "./navBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  // data store from provider
  const { activityStore } = useStore();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [submitting, setSubmitting] = useState(false);

  

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  function handleDeleteActivity(id: string) {
    setSubmitting(true)
    agent.Activities.delete(id).then(() => {
      setActivities([...activities.filter((x) => x.id !== id)]);
      setSubmitting(false);
    })
    
  }

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App...'/>

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>

        {/* <h2>{activityStore.title}</h2>
        <Button content ="Add exclamation point!" positive onClick={activityStore.setTitle} /> */}

        <ActivityDashboard
          activities={activityStore.activities}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
}

export default observer(App) ;
