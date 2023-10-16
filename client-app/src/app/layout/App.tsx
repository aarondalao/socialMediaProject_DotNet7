import { Fragment, useEffect } from "react";
import { Segment } from "semantic-ui-react";
import NavBar from "./navBar";
import { observer } from "mobx-react-lite";
import { Outlet, ScrollRestoration, useLocation } from "react-router-dom";
import Homepage from "../../features/home/Homepage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";
import NavbarMobile from "./navbarMobile";

export default observer(function App() {
  const location = useLocation();
  const { commonStore, userStore } = useStore();

  // mobx store for the window viewport
  const { viewportStore } = useStore();
  const { width } = viewportStore;

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded)
    return <LoadingComponent content="Loading app..." />;

  return (
    <Fragment>
      <ScrollRestoration />
      <ModalContainer />
      <ToastContainer position="bottom-right" theme="colored" />
      {location.pathname === "/" ? (
        <Homepage />
      ) : (
        <>
          {width <= 768 ? (
            <NavbarMobile />
          ) : (
            <>
              <NavBar />
              <Segment style={{ marginTop: "8em" }}>
                <Outlet />
              </Segment>
            </>
          )}
        </>
      )}
    </Fragment>
  );
});
// export default observer(App);
