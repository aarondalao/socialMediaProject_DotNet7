import React, { Fragment, useEffect } from "react";
import { Container } from "semantic-ui-react";
import NavBar from "./navBar";
import { observer } from "mobx-react-lite";
import { Outlet, useLocation } from "react-router-dom";
import Homepage from "../../features/home/Homepage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const location = useLocation();

  const { commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => 
        commonStore.setAppLoaded()
      );
    }
    else{
      commonStore.setAppLoaded()
    }
  }, [ commonStore, userStore ])

  if(!commonStore.appLoaded) return <LoadingComponent content="Loading app..." />

  return (
    <Fragment>
      <ModalContainer />
      <ToastContainer position="bottom-right" theme="colored" />
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
