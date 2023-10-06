import { Fragment, useEffect, useRef, useState } from "react";
import {
  Button,
  Container,
  Icon,
  Image,
  Menu,
  Segment,
  Sidebar,
} from "semantic-ui-react";
import NavBar from "./navBar";
import { observer } from "mobx-react-lite";
import {
  NavLink,
  Outlet,
  ScrollRestoration,
  useLocation,
} from "react-router-dom";
import Homepage from "../../features/home/Homepage";
import { ToastContainer } from "react-toastify";
import { useStore } from "../stores/store";
import LoadingComponent from "./LoadingComponent";
import ModalContainer from "../common/modals/ModalContainer";

function App() {
  const location = useLocation();

  const { commonStore, userStore } = useStore();

  // TODO: create a new store for setting navigation bar
  const [sideBarVisibility, setSideBarVisibility] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const segmentRef = useRef()

  const handleSidebarVisibililty = () => {
    if (width < 768) setSideBarVisibility(true);
    else setSideBarVisibility(false);
  };

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
    });

    handleSidebarVisibililty();

    return () => {
      window.removeEventListener("resize", () => {});
    };
  }, [width, setSideBarVisibility]);

  const toggleSidebar = () => {
    setSideBarVisibility(!sideBarVisibility);
    console.log("kjhasdfklhjnsadflkdsaf");
  };

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
            <>
              {/* TODO: transfer this into a new file  */}
              <Menu inverted fixed="top">
                <Container className="nav_bar_mobile">
                  <Menu.Item as="a" onClick={toggleSidebar}>
                    <Icon
                      name="bars"
                      style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                    />
                  </Menu.Item>
                  <Menu.Item position="right" as="a">
                    <Icon
                      name="filter"
                      style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
                    />
                  </Menu.Item>
                </Container>
              </Menu>
              <Sidebar.Pushable as={Segment}>
                {sideBarVisibility && (
                  <Sidebar
                    as={Menu}
                    animation="uncover"
                    visible={sideBarVisibility}
                    // icon="labeled"
                    vertical
                    inverted
                    target={segmentRef}
                  >
                    
                      <Menu.Item as={NavLink} to="/" header>
                        <Image
                          src="/assets/logo.png"
                          size="tiny"
                          style={{ marginTop: "2rem" }}
                        />
                        How-to Club
                      </Menu.Item>

                      <Menu.Item
                        as={NavLink}
                        to="/activities"
                        name="Activities"
                        icon="book"
                        onClick={toggleSidebar}
                      />
                      <Menu.Item
                        as={NavLink}
                        to="/errors"
                        name="Errors"
                        icon="ban"
                        onClick={toggleSidebar}
                      />
                    
                  </Sidebar>
                )}
                <Sidebar.Pusher dimmed={sideBarVisibility}>
                  <Segment style={{ marginTop: "8em" }} ref={segmentRef}>
                    <Outlet />
                  </Segment>
                </Sidebar.Pusher>
              </Sidebar.Pushable>
            </>
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
}
export default observer(App);
