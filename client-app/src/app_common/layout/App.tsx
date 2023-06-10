import React, { Fragment, useEffect, useState } from "react";
import { Button, Container } from "semantic-ui-react";
import { v4 as uuid } from "uuid";

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
  const [selectedActivity, setSelectedActivity] = useState<
    Activity | undefined>(undefined);
  const [editMode, setEditMode] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);


  function handleCreateOrEditActivity(activity: Activity) {
    setSubmitting(true);

    if(activity.id) {
      agent.Activities.update(activity).then(() => {
        setActivities([...activities.filter((x) => x.id !== activity.id),activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    } else {
      activity.id = uuid();
      agent.Activities.create(activity).then(() => {
        setActivities([...activities, activity])
        setSelectedActivity(activity);
        setEditMode(false);
        setSubmitting(false);
      })
    }
  }

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
          createOrEdit={handleCreateOrEditActivity}
          deleteActivity={handleDeleteActivity}
          submitting={submitting}
        />
      </Container>
    </Fragment>
  );
}

export default observer(App) ;
