import React, { Fragment } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./navBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import Homepage from "../../features/home/Homepage";

function App() {
  const location = useLocation();

  return (
    <Fragment>
      {location.pathname === "/" ? (
        <Homepage />
      ) : (
        <Fragment>
          <NavBar />
          <Container style={{ marginTop: "7em" }}>
            <Outlet />
          </Container>
        </Fragment>
      )}
    </Fragment>
  );
}
export default observer(App);
