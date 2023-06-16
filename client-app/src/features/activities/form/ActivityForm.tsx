import React, { ChangeEvent, useEffect, useState } from "react";
import { Button, FormField, Header, Label, Segment } from "semantic-ui-react";
import { useStore } from "../../../app/stores/store";
import { observer } from "mobx-react-lite";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Activity } from "../../../app/models/activity";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { v4 as uuid } from "uuid";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from 'yup';
import MyTextInput from "../../../app/common/form/MyTextInputs";

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
    date: "",
    description: "",
    category: "",
    city: "",
    venue: "",
  });

  const validationSchema = Yup.object({
    title: Yup.string().required('The activity title is required')
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

          
          <Form className='ui form' onSubmit={handleSubmit} autoComplete="off">
            <MyTextInput name="title" placeholder="Title" />
            <MyTextInput
              placeholder="Title"
              name="title"
            />
            <MyTextInput
              placeholder="Description"
              name="description"
            />
            <MyTextInput
              placeholder="Category"
              name="category"
            />

            {/*  TODO: implement date form here */}
            <MyTextInput
              placeholder="Date"
              
              name="date"
            />

            {/* ================================== end todo ========================================================= */}
            <MyTextInput
              placeholder="City"
              name="city"
            />
            <MyTextInput
              placeholder="Venue"
              name="venue"
            />

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
