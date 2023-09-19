import { Button, Container, Menu, Image, Dropdown } from "semantic-ui-react";
import { Link, NavLink } from "react-router-dom";
import { useStore } from "../stores/store";
import { observer } from "mobx-react-lite";

export default observer(function NavBar() {
  const {
    userStore: { user, logout, isLoggedIn },
  } = useStore();

  return (
    <Menu inverted fixed="top">
      {isLoggedIn ? (
        <Container>
          <Menu.Item as={NavLink} to="/" header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "30px" }}
            />
            How-to Club
          </Menu.Item>

          <Menu.Item as={NavLink} to="/activities" name="Activities" />
          <Menu.Item as={NavLink} to="/errors" name="Errors" />
          <Menu.Item>
            <Button
              positive
              content="Create Activity"
              // onClick={() => activityStore.openForm()}
              as={NavLink}
              to="/createActivity" 
            />
          </Menu.Item>

          <Menu.Item position="right">
            <Image
              src={user?.image || "/assets/user.png"}
              avatar
              spaced="right"
            />
            <Dropdown pointing="top left" text={user?.displayName}>
              <Dropdown.Menu>
                <Dropdown.Item
                  as={Link}
                  to={`/profiles/${user?.username}`}
                  text="My Profile"
                  icon="user"
                />
                <Dropdown.Item onClick={logout} text="Logout" incon="power" />
              </Dropdown.Menu>
            </Dropdown>
          </Menu.Item>
        </Container>
      ): (
        <Container>
          <Menu.Item as={NavLink} to="/" header>
            <img
              src="/assets/logo.png"
              alt="logo"
              style={{ marginRight: "30px" }}
            />
            How-to Club
          </Menu.Item>
        </Container>
      )}
    </Menu>
  );
});
