import React, { SyntheticEvent, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
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
    <Segment.Group>
        <Segment>
            <Item.Group>
                <Item>
                    <Item.Image size='tiny' circular src='/assets/user.png' />
                    <Item.Content>
                        <Item.Header as={Link} to={`/activities/${activity.id}`}>
                            { activity.title}
                        </Item.Header>
                        <Item.Description>Hosted by bob</Item.Description>

                    </Item.Content>
                </Item>
            </Item.Group>
        </Segment>
            
        <Segment>
        <span>
                <Icon name='clock'/> { activity.date }
                <Icon name="marker"/> { activity.venue }
            </span>
        </Segment>
        <Segment secondary >
            Attendees go here
        </Segment>
        <Segment clearing>
            <span> {activity.description} </span>
            <Button as={Link} to={`/activities/${activity.id}`} color="teal" floated="right" content="View"/>
        </Segment>
    </Segment.Group>
  );
}