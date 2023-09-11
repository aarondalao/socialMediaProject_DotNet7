/*
  TODO: Change the background gradient into a stock video
*/

import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";

export default observer(function Homepage() {
  const { userStore, modalStore } = useStore();
  return (
    <Segment inverted textAlign="center" vertical className="mastHead">
      <Container text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: 12 }}
          />
          HtC
        </Header>

        {userStore.isLoggedIn ? (
          // render if user is logged in
          <>
            <Header as="h2" inverted content={`Welcome back ${userStore.user?.displayName} to How-to Club`} />
            <Button
              as={Link}
              to="/activities"
              size="huge"
              inverted
              content="Let's learn!"
            />
          </>
        ) : (
          // render if user is logged out
          <>
            <Button
              onClick={() => modalStore.openModal( <LoginForm /> )}
              size="huge"
              inverted
              content="Login"
            />

<Button
              onClick={() => modalStore.openModal( <RegisterForm /> )}
              size="huge"
              inverted
              content="Register"
            />
          </>
        )}
      </Container>
    </Segment>
  );
});
