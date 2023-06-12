import { useEffect } from "react";
import { Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import { useStore } from "../../../app_common/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app_common/layout/LoadingComponent";

export default observer(function ActivityDashboard() {
  // data store from provider
  const { activityStore } = useStore();
  const { selectedActivity, editMode } = activityStore;

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading App...'/>

  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList/>
      </Grid.Column>
      <Grid.Column width="6">
        {selectedActivity && !editMode && <ActivityDetails />}
        <h2>activity filters</h2>
        
      </Grid.Column>
    </Grid>
  );
});
