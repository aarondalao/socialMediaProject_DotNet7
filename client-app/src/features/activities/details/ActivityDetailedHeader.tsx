import { Activity } from "../../../app/models/activity";
import { observer } from "mobx-react-lite";
import { Segment, Image, Item, Header, Button, Label } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { useStore } from "../../../app/stores/store";

const activityImageStyle = {
  filter: "brightness(30%)",
};

const activityImageTextStyle = {
  position: "absolute",
  bottom: "5%",
  left: "5%",
  width: "100%",
  height: "auto",
  color: "white",
};

interface Props {
  activity: Activity;
}

export default observer(function ActivityDetailedHeader({ activity }: Props) {
  const {
    activityStore: { updateAttendance, loading, cancelActivityToggle },
  } = useStore();
  return (
    <Segment.Group>
      <Segment basic attached="top" style={{ padding: "0" }}>
        {activity.isCancelled && (
          <Label
            style={{ position: "absolute", zIndex: 1000, left: -14, top: 20 }}
            ribbon
            color="red"
            content="Cancelled"
          />
        )}
        <Image
          src={`/assets/categoryImages/${activity.category}.jpg`}
          fluid
          style={activityImageStyle}
        />
        <Segment basic style={activityImageTextStyle}>
          <Item.Group>
            <Item>
              <Item.Content>
                <Header
                  size="huge"
                  content={activity.title}
                  style={{ color: "white" }}
                />
                <p>{format(activity.date!, "dd MMM yyyy h:mm aa")}</p>
                <p>
                  Hosted by{" "}
                  <strong>
                    <Link to={`/profiles/${activity.host?.username}`}>
                      {activity.host?.displayName}
                    </Link>
                  </strong>
                </p>
              </Item.Content>
            </Item>
          </Item.Group>
        </Segment>
      </Segment>
      <Segment clearing attached="bottom">
        {activity.isHost ? (
          <>
            {/* change this */}
            <Button
              color={activity.isCancelled ? 'green' : 'red' }
              floated="left"
              basic
              content={activity.isCancelled ? "Re-activate Activity" : "Cancel Activity"}
              onClick={cancelActivityToggle}
              loading={loading}
            />
            <Button
              as={Link}
              to={`/manage/${activity.id}`}
              disabled={activity.isCancelled}
              color="orange"
              floated="right"
              content="manage event"
            />
          </>
        ) : activity.isGoing ? (
          <Button loading={loading} onClick={updateAttendance}>
            Cancel Attendance
          </Button>
        ) : (
          <Button loading={loading} disabled={activity.isCancelled} onClick={updateAttendance} color="blue">
            Join Activity
          </Button>
        )}
      </Segment>
    </Segment.Group>
  );
});
