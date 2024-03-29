/*
  TODO: filter and datetime should be hidden when in mobile view
*/

import { useEffect, useState } from "react";
import { Grid, Loader, Segment } from "semantic-ui-react";
import ActivityList from "./ActivityList";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import ActivityFilters from "./ActivityFilters";
import { PagingParams } from "../../../app/models/pagination";
import InfiniteScroll from "react-infinite-scroller";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

export default observer(function ActivityDashboard() {
  // data store from provider
  const { activityStore, viewportStore } = useStore();
  const { loadActivities, activityRegistry, setPagingParameters, pagination } =
    activityStore;
  const { width } = viewportStore;

  const [loadingNext, setLoadingNext] = useState(false);

  function handleGetNextItems() {
    setLoadingNext(true);
    setPagingParameters(new PagingParams(pagination!.currentPage + 1));
    loadActivities().then(() => setLoadingNext(false));
  }

  useEffect(() => {
    if (activityRegistry.size <= 1) {
      loadActivities();
    }
  }, [loadActivities, activityRegistry]);

  // if (activityStore.loadingInitial && !loadingNext) return <LoadingComponent  content='Loading Events and Activities near you...'/>

  return (
    <>
      {width <= 768 ? (
        <Segment>
          {activityStore.loadingInitial &&
          activityRegistry.size === 0 &&
          !loadingNext ? (
            <>
              <ActivityListItemPlaceholder />
              <ActivityListItemPlaceholder />
              <ActivityListItemPlaceholder />
            </>
          ) : (
            <InfiniteScroll
              pageStart={0}
              loadMore={handleGetNextItems}
              hasMore={
                !loadingNext &&
                !!pagination &&
                pagination.currentPage < pagination.totalPages
              }
              initialLoad={false}
            >
              <ActivityList />
            </InfiniteScroll>
          )}
        </Segment>
      ) : (
        <Grid>
          <Grid.Column width="10">
            {activityStore.loadingInitial &&
            activityRegistry.size === 0 &&
            !loadingNext ? (
              <>
                <ActivityListItemPlaceholder />
                <ActivityListItemPlaceholder />
                <ActivityListItemPlaceholder />
              </>
            ) : (
              <InfiniteScroll
                pageStart={0}
                loadMore={handleGetNextItems}
                hasMore={
                  !loadingNext &&
                  !!pagination &&
                  pagination.currentPage < pagination.totalPages
                }
                initialLoad={false}
              >
                <ActivityList />
              </InfiniteScroll>
            )}
          </Grid.Column>
          <Grid.Column width="6">
            <ActivityFilters /> 
          </Grid.Column>
          <Grid.Column width={10}>
            <Loader active={loadingNext} />
          </Grid.Column>
        </Grid>
      )}
    </>
  );
});
