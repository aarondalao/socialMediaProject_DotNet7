import React, { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import MyTextInput from "../../../app/common/form/MyTextInputs";
import MyTextArea from "./MyTextArea";
import MySelectInput from "./MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "./MyDateInput";

export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    loading,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();

  // const navigate = useNavigate();

  const currentLocation = useLocation();

  const [activity, setActivity] = useState<Activity>({
    id: "",
    title: "",
    date: null,
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required("The activity title is required"),
    description: Yup.string().required("The activity description is required"),
    category: Yup.string().required("The activity category is required"),
    date: Yup.string().required(),
    venue: Yup.string().required(),
    city: Yup.string().required(),
  });

  useEffect(() => {
    if (id) {
      loadActivity(id).then((activity) => {
        setActivity(activity!);
      });
    }
  }, [id, loadActivity]);

  // function handleSubmit() {
  //   if(!activity.id){
  //     activity.id = uuid();
  //     createActivity(activity).then(() => {
  //       navigate(`/activities/${activity.id}`)
  //     })
  //   }
  //   else {
  //     updateActivity(activity).then(() => {
  //       navigate(`/activities/${activity.id}`)
  //     })
  //   }
  // }

  // function handleChange(
  //   event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  // ) {
  //   const { name, value } = event.target;
  //   setActivity({ ...activity, [name]: value });
  // }

  if (loadingInitial) return <LoadingComponent content="Loading activity..." />;

  return (
    <Segment clearing>
      {currentLocation.pathname === "/createActivity" ? (
        <Header size="large" color="teal">
          {" "}
          Create an Activity{" "}
        </Header>
      ) : (
        <Header size="large" color="blue">
          {" "}
          Edit an Activity{" "}
        </Header>
      )}

      <Formik
        initialValues={activity}
        enableReinitialize
        onSubmit={(values) => console.log(values)}
        validationSchema={validationSchema}
      >
        {({ handleSubmit }) => (
          <Form className="ui form" onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput placeholder="Title" name="title" />
            <MyTextArea
              placeholder="Description"
              name="description"
              rows={10}
            />
            <MySelectInput
              placeholder="Category"
              name="category"
              options={categoryOptions}
            />

            <MyDateInput
              placeholderText="Date"
              name="date"
              showTimeSelect
              timeCaption="time"
              dateFormat="MMMM d, yyyy  h:mm aa"
            />

            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
            />
            <Button
              as={Link}
              to="/activities"
              floated="right"
              type="button"
              content="Cancel"
            />
          </Form>
        )}
      </Formik>
    </Segment>
  );
});
