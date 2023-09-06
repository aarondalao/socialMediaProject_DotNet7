import { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";

export default observer(function ActivityDashboard() {
  // data store from provider
  const { activityStore } = useStore();
  const { loadActivities, activityRegistry, setPagingParameters, pagination } = activityStore;
  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNextItems() {

    setLoadingNext(true);
    setPagingParameters(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if(activityRegistry.size <= 1){
      loadActivities();
    }
  }, [loadActivities, activityRegistry]);


  if (activityStore.loadingInitial && !loadingNext) return <LoadingComponent  content='Loading Events and Activities near you...'/>
  return (
    <Grid>
      <Grid.Column width="10">
        <ActivityList/>
        <Button
          floated="right"
          content='More...'
          positive
          onClick={handleGetNextItems}
          loading={loadingNext}
          disabled={pagination?.totalPages === pagination?.currentPage}
        />
      </Grid.Column>
      <Grid.Column width="6">
        <ActivityFilters />
      </Grid.Column>
    </Grid>
  );
});
