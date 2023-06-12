import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Item, Label } from "semantic-ui-react";
import { Activity } from "../../../app_common/models/activity";
import { useStore } from "../../../app_common/stores/store";

interface Props {
  activity: Activity;
}

export default function ActivityListItem({ activity }: Props) {
  // target activity local state
  const [target, setTarget] = useState("");

  const {
    activityStore: { deleteActivity, loading },
  } = useStore();

  function handleDeleteActivity(
    e: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) {
    setTarget(e.currentTarget.name);
    deleteActivity(id);
  }

  return (
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
            as={Link}
            to={`/activities/${activity.id}`}
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
  );
}
