import { observer } from "mobx-react-lite";
import { NavLink, Outlet } from "react-router-dom";
import {
  Menu,
  Container,
  Icon,
  Sidebar,
  Segment,
  Image,
} from "semantic-ui-react";
import { useStore } from "../stores/store";
import { useEffect, Fragment } from "react";
import ActivityFilters from "../../features/activities/dashboard/ActivityFilters";

export default observer(function NavbarMobile() {
  // mobx store for the window viewport
  const { viewportStore, userStore } = useStore();
  const { user, logout, isLoggedIn } = userStore;
  const {
    navigationSidebar,
    filterSidebar,
    sidebarSelector,
    setWindow,
    handleSidebar,
    toggleNavVisibility,
    toggleFilterVisibility,
    closeSidebars,
  } = viewportStore;
  

  useEffect(() => {
    window.addEventListener("resize", () => {
      setWindow(window.innerWidth, window.innerHeight);
      handleSidebar();
    });

    // handleSidebarVisibililty();

    window.removeEventListener("resize", () => {});
  }, [setWindow, handleSidebar]);

  return (
    <Fragment>
      <Menu inverted fixed="top">
        {isLoggedIn ? (
          <Container className="nav_bar_mobile">
            <Menu.Item as="a" onClick={toggleNavVisibility}>
              <Icon
                name="bars"
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
              />
            </Menu.Item>
            <Menu.Item position="right" as="a" onClick={toggleFilterVisibility}>
              <Icon
                name="filter"
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
              />
            </Menu.Item>
          </Container>
        ) : (
          <Container className="nav_bar_mobile">
            <Menu.Item as="a" onClick={toggleNavVisibility}>
              <Icon
                name="bars"
                style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
              />
            </Menu.Item>
          </Container>
        )}
      </Menu>

      <Sidebar.Pushable>
        {isLoggedIn ? (
          <>
            <Sidebar
              as={Menu}
              animation="push"
              visible={navigationSidebar}
              vertical
              inverted
              
              direction="left"
            >
              <Menu.Item as={NavLink} to="/" header>
                <Image
                  src="/assets/logo.png"
                  size="tiny"
                  style={{ marginTop: "5rem" }}
                />
                How-to Club
              </Menu.Item>

              <Menu.Item
                as={NavLink}
                to="/activities"
                name="Activities"
                icon="book"
                onClick={toggleNavVisibility}
              />
              <Menu.Item
                as={NavLink}
                to="/errors"
                name="Errors"
                icon="ban"
                onClick={toggleNavVisibility}
              />

              <Menu.Item
                as={NavLink}
                to={`/profiles/${user?.username}`}
                name="My Profile"
                icon="user"
                onClick={toggleNavVisibility}
                
              />

              <Menu.Item name="Logout" icon="power" onClick={logout} />
            </Sidebar>

            <Sidebar
              as={Menu}
              animation="push"
              visible={filterSidebar}
              vertical
              inverted
              direction="right"
            >
              <Container style={{ marginTop: "5rem" }}>
                <ActivityFilters />
              </Container>
            </Sidebar>

            <Sidebar.Pusher
              onClick={closeSidebars}
              dimmed={
                sidebarSelector == "nav" ? navigationSidebar : filterSidebar
              }
            >
              <Segment style={{ marginTop: "8em" }} >
                <Outlet />
              </Segment>
            </Sidebar.Pusher>
          </>
        ) : (
          <>
            <Sidebar
              as={Menu}
              animation="push"
              visible={navigationSidebar}
              vertical
              inverted
              direction="left"
            >
              <Menu.Item as={NavLink} to="/" header>
                <Image
                  src="/assets/logo.png"
                  size="tiny"
                  style={{ marginTop: "5rem" }}
                />
                How-to Club
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher dimmed={navigationSidebar}>
              <Segment style={{ marginTop: "8em" }}>
                <Outlet />
              </Segment>
            </Sidebar.Pusher>
          </>
        )}
      </Sidebar.Pushable>
    </Fragment>
  );
});
