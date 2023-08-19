/*
    NOTE: 
    this only hardcoded comment feature. NOT WORKING AS OF JUNE 13, 2023
*/
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Button, Header, Segment, Comment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { Link } from "react-router-dom";
import { Formik, Form } from "formik";
import MyTextArea from "../form/MyTextArea";

interface Props {
  activityId: string;
}

export default observer(function ActivityDetailedChat({ activityId }: Props) {
  const { commentStore } = useStore();

  useEffect(() => {
    if (activityId) {
      commentStore.createHubConnection(activityId);
    }
    return () => {
      commentStore.clearComments();
    };
  }, [activityId, commentStore]);

  return (
    <>
      <Segment
        textAlign="center"
        attached="top"
        inverted
        color="teal"
        style={{ border: "none" }}
      >
        <Header>Chat about this event</Header>
      </Segment>
      <Segment attached clearing>
        <Comment.Group>
          {commentStore.comments.map((comment) => (
            <Comment key={comment.id}>
              <Comment.Avatar src={comment.image || "/assets/user.png"} />
              <Comment.Content>
                <Comment.Author as={Link} to={`/profiles/${comment.username}`}>
                  {comment.username}
                </Comment.Author>
                <Comment.Metadata>
                  <div>{comment.createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>{comment.body}</Comment.Text>
              </Comment.Content>
            </Comment>
          ))}

          <Formik
            onSubmit={(values, { resetForm }) =>
              commentStore.addComment(values).then(() => resetForm)
            }
            initialValues={{ body: "" }}
          >
            {({ isSubmitting, isValid }) => (
              <Form className="ui form">
                <MyTextArea placeholder="Add comment" name='body' rows={2} />
                <Button
                  content="Add Reply"
                  labelPosition="left"
                  icon="edit"
                  primary
                  loading={isSubmitting}
                  disabled={isSubmitting || !isValid}
                  type="submit"
                  floated="right"
                />
              </Form>
            )}
          </Formik>
        </Comment.Group>
      </Segment>
    </>
  );
});
