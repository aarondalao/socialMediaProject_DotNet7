/*
  TODO: use Segments instead of grids
*/

import { useState } from "react";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import axios from "axios";
import ValidationError from "./ValidationError";
import { useStore } from "../../app/stores/store";

export default function TestErrors() {
  const [errors, setErrors] = useState(null);
  const { viewportStore } = useStore();
  const { width } = viewportStore;

  function handleNotFound() {
    axios.get("/buggy/not-found").catch((err) => console.log(err.response));
  }

  function handleBadRequest() {
    axios.get("/buggy/bad-request").catch((err) => console.log(err.response));
  }

  function handleServerError() {
    axios.get("/buggy/server-error").catch((err) => console.log(err.response));
  }

  function handleUnauthorised() {
    axios.get("/buggy/unauthorised").catch((err) => console.log(err.response));
  }

  function handleBadGuid() {
    axios.get("/activities/notaguid").catch((err) => console.log(err.response));
  }

  function handleValidationError() {
    axios.post("/activities", {}).catch((err) => setErrors(err));
  }

  return (
    <>
      <Header as="h1" content="Test Error component" />
      {width <= 768 ? (
        <Grid doubling stackable container rows={6}>
          <Grid.Row>
            <Grid.Column>
              <Segment textAlign="center" onClick={handleNotFound} content="Not Found" color="red"/>
              {/* <Button
              onClick={handleNotFound}
              content="Not Found"
              basic
              primary
            /> */}
            </Grid.Column>
            <Grid.Column>
              <Segment textAlign="center" onClick={handleBadRequest} content="Bad Request" color="red"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment
                onClick={handleValidationError}
                content="Validation Error"
                textAlign="center" color="red"
              />
            </Grid.Column>
            <Grid.Column>
              <Segment textAlign="center" onClick={handleServerError} content="Server Error" color="red"/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Segment textAlign="center" onClick={handleUnauthorised} content="Unauthorised" color="red"/>
            </Grid.Column>
            <Grid.Column>
              <Segment textAlign="center" onClick={handleBadGuid} content="Bad Guid" color="red"/>
            </Grid.Column>
          </Grid.Row>
          
            {errors && <ValidationError errors={errors} />}
          
        </Grid>
      ) : (
        <Segment.Group raised padded="very">
          <Segment>
            <Button.Group widths="7">
              <Button
                onClick={handleNotFound}
                content="Not Found"
                basic
                primary
              />
              <Button
                onClick={handleBadRequest}
                content="Bad Request"
                basic
                primary
              />
              <Button
                onClick={handleValidationError}
                content="Validation Error"
                basic
                primary
              />
              <Button
                onClick={handleServerError}
                content="Server Error"
                basic
                primary
              />
              <Button
                onClick={handleUnauthorised}
                content="Unauthorised"
                basic
                primary
              />
              <Button
                onClick={handleBadGuid}
                content="Bad Guid"
                basic
                primary
              />
            </Button.Group>
          </Segment>
          {errors && <ValidationError errors={errors} />}
        </Segment.Group>
      )}
    </>
  );
}
