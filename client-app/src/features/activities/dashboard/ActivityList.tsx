import React from 'react'
import { Item, Segment } from "semantic-ui-react";
import { useStore } from "../../../app_common/stores/store";
import { observer } from "mobx-react-lite";
import ActivityListItem from './ActivityListItem';

export default observer( function ActivityList() {
  // from dataStore
  const {activityStore} = useStore();

  // destructured activityStore
  const { activitiesByDate} = activityStore;
  

  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <ActivityListItem key={activity.id} activity={activity} />
        ))}
      </Item.Group>
    </Segment>
  );
})
