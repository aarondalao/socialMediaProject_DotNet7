import React from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Activity } from "../../../app_common/models/activity";
import { useStore } from "../../../app_common/stores/store";
import LoadingComponent from "../../../app_common/layout/LoadingComponent";

export default function ActivityDetails() {

  const {activityStore} = useStore();
  const { selectedActivity: activity, openForm, cancelSelectedActivity } = activityStore;

  if(!activity) return <LoadingComponent/>;

  return (
    <Card fluid>
      <Image src={`./assets/categoryImages/${activity.category}.jpg`} alt="Activity category"/>
      <Card.Content>
        <Card.Header>{ activity.title }</Card.Header>
        <Card.Meta>
          <span>{ activity.date }</span>
        </Card.Meta>
        <Card.Description>
          { activity.description }
        </Card.Description>
      </Card.Content>
      <Card.Content extra>
        <Button.Group widths='2'>
            <Button basic color="blue" content='Edit' onClick={() => openForm(activity.id)}/>
            <Button basic color="grey" content='Cancel' onClick={ activityStore.cancelSelectedActivity }/>
        </Button.Group>
      </Card.Content>
    </Card>
  );
}
