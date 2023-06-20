// package
import React, { useEffect, useState } from "react";
import { Button, Header, Segment } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { v4 as uuid } from 'uuid';

// models and state management stores
import { useStore } from "../../../app/stores/store";
import { Activity } from "../../../app/models/activity";
import { categoryOptions } from "../../../app/common/options/categoryOptions";

// components
import MyTextInput from "../../../app/common/form/MyTextInputs";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import MyTextArea from "./MyTextArea";
import MySelectInput from "./MySelectInput";
import MyDateInput from "./MyDateInput";


export default observer(function ActivityForm() {
  const { activityStore } = useStore();
  const {
    loading,
    createActivity,
    updateActivity,
    loadActivity,
    loadingInitial,
  } = activityStore;

  const { id } = useParams();

  const navigate = useNavigate();

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
    date: Yup.string().required("The Date is required").nullable(), 
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

  function handleFormSubmit(activity: Activity) {
    if (!activity.id || activity.id.length === 0) {
      activity.id = uuid();
      createActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`)
      })
    }
    else {
      updateActivity(activity).then(() => {
        navigate(`/activities/${activity.id}`)
      })
    }
  }


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
      <Header content="Activity Details" color="teal" sub/>

      <Formik
        initialValues={activity}
        enableReinitialize
        onSubmit={(values) => handleFormSubmit(values)}
        validationSchema={validationSchema}
      >
        {({ handleSubmit, isValid, isSubmitting, dirty }) => (
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

            <Header content="Location Details" color="teal" sub/>

            <MyTextInput placeholder="City" name="city" />
            <MyTextInput placeholder="Venue" name="venue" />

            <Button
              loading={loading}
              floated="right"
              positive
              type="submit"
              content="Submit"
              disabled ={ isSubmitting || !dirty || !isValid }
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


