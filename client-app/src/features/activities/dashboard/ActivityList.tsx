import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app_common/stores/store";
import { observer } from "mobx-react-lite";

export default observer( function ActivityList() {
  // from dataStore
  const {activityStore} = useStore();

  // destructured activityStore
  const {deleteActivity, activitiesByDate, loading} = activityStore;

  // target activity local state
  const [target, setTarget] = useState("");


  function handleDeleteActivity(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }
  return (
    <Segment>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as="a">{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div> {activity.description}</div>
                <div>
                  {" "}
                  {activity.city}, {activity.venue}{" "}
                </div>
              </Item.Description>
              <Item.Extra>
                <Button
                  onClick={() => activityStore.selectActivity(activity.id)}
                  floated="right"
                  content="View"
                  color="blue"
                />

                {/* TODO: add alert button to double check deleting an event */}
                <Button
                  name={activity.id}
                  loading={loading && target === activity.id}
                  onClick={(e) => handleDeleteActivity(e, activity.id)}
                  floated="right"
                  content="Delete"
                  color="red"
                />
                <Label basic content={activity.category} />
              </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  );
})
