import React, { SyntheticEvent, useState } from "react";
import { Activity } from "../../../app_common/models/activity";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app_common/stores/store";

interface Props {
  activities: Activity[];
  deleteActivity: (id: string) => void;
  submitting: boolean;
}

export default function ActivityList({
  activities,
  deleteActivity,
  submitting,
}: Props) {
  const [target, setTarget] = useState("");

  // from dataStore
  const {activityStore} = useStore();


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
        {activities.map((activity) => (
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
                  loading={submitting && target === activity.id}
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
}
