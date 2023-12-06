/*
  TODO: Change the background gradient into a stock video
*/

import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button, Divider } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";
import { observer } from "mobx-react-lite";
import LoginForm from "../users/LoginForm";
import RegisterForm from "../users/RegisterForm";
import FacebookLogin, { FailResponse, SuccessResponse } from "@greatsumini/react-facebook-login";


// TODO: test video
// import bgVideo from "../assets/how2club.mp4";

export default observer(function Homepage() {
  const { userStore, modalStore } = useStore();

  return (
    <Segment inverted textAlign="center" vertical className="mastHead">
      {/* <video
        src={bgVideo}
        typeof="video/mp4"
        loop
        controls={false}
        autoPlay
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          zIndex: 1
        }}
      /> */}
      <Container className="container" text>
        <Header as="h1" inverted>
          <Image
            size="massive"
            src="/assets/logo.png"
            alt="logo"
            style={{ marginBottom: "12", zIndex: 2 }}
          />
          HtC
        </Header>
        <Container className="wrapper">
        {userStore.isLoggedIn ? (
          // render if user is logged in
          <>
            <Header
              as="h2"
              inverted
              content={`Welcome back ${userStore.user?.displayName} to How-to Club`}
              style={{ zIndex: 10 }}
            />
            <Button
              as={Link}
              to="/activities"
              size="huge"
              inverted
              content="Let's learn!"
              style={{ zIndex: 2 }}
            />
          </>
        ) : (
          // render if user is logged out
          <>
            <Button
              onClick={() => modalStore.openModal(<LoginForm />)}
              size="huge"
              inverted
              content="Login"
              style={{ zIndex: 2 }}
            />

            <Button
              onClick={() => modalStore.openModal(<RegisterForm />)}
              size="huge"
              inverted
              content="Register"
              style={{ zIndex: 2 }} 
            />

            <Divider inverted horizontal>Or</Divider>
            {/* using how2club-consumer-trial app in meta dev */}
            <FacebookLogin 
              appId='25266070246325831'
              onSuccess={(response: SuccessResponse) => {
                userStore.facebookLogin(response.accessToken);
                console.log("Facebook Login Succeeded", response)

              }}
              onFail={(response:  FailResponse) => {
                console.log("Facebook Login Failed", response)
              }}
              className={`ui button facebook huge inverted ${userStore.facebookLoading && 'loading'}`}
            />

            {/* <FacebookLogin
            appId="25266070246325831"
            onSuccess={(response: SuccessResponse) => {console.log("login passed", response)}}
            onFail={(response: FailResponse) => {console.log("login failed"), response}}
            className={`ui button facebook huge inverted ${userStore.facebookLoading && 'loading'}`}
            /> */}
          </>
        )}
        </Container>
      </Container>
    </Segment>
  );
});
