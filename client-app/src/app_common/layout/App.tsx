import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./navBar";
import { observer } from "mobx-react-lite";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <Fragment>
      <NavBar/>
      <Container style={{ marginTop: "7em" }}>
        {/* <h2>{activityStore.title}</h2>
        <Button content ="Add exclamation point!" positive onClick={activityStore.setTitle} /> */}
        <Outlet />
      </Container>
    </Fragment>
  );
}
export default observer(App) ;
