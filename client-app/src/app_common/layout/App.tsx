import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";

// components
import NavBar from "./navBar";
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import LoadingComponent from "./LoadingComponent";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

function App() {
  // data store from provider
  const { activityStore } = useStore();

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App...'/>

  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>

        {/* <h2>{activityStore.title}</h2>
        <Button content ="Add exclamation point!" positive onClick={activityStore.setTitle} /> */}

        <ActivityDashboard />
      </Container>
    </Fragment>
  );
}

export default observer(App) ;
