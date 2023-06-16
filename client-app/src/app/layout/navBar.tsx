import { Button, Container, Menu } from "semantic-ui-react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  return (
    <Menu inverted fixed="top">
      <Container>
        <Menu.Item as={NavLink} to='/' header>
          <img
            src="/assets/logo.png"
            alt="logo"
            style={{ marginRight: "30px" }}
          />
          How-to Club
        </Menu.Item>
        <Menu.Item as={NavLink} to='/activities' name="Activities" />
        <Menu.Item as={NavLink} to='/errors' name="Errors" />
        <Menu.Item>
          <Button
            positive
            content="Create Activity"
            // onClick={() => activityStore.openForm()}
            as ={NavLink} to='/createActivity'
          />
        </Menu.Item>
      </Container>
    </Menu>
  );
}
