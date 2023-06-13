/*
  TODO: Change the background gradient into a stock video
*/ 

import { Link } from "react-router-dom";
import { Container, Header, Segment, Image, Button } from "semantic-ui-react";

export default function Homepage() {
  return (
    <Segment inverted textAlign='center' vertical className="mastHead">
      <Container text>
        <Header as='h1' inverted>
          <Image size="massive" src='/assets/logo.png' alt='logo' style= {{ marginBottom: 12 }}/>
          HtC
        </Header>
        <Header as='h2' inverted content='Welcome to How-to Club'/>
        <Button as={Link} to='/activities' size="huge" inverted content="take me to the movement!"/>
      </Container>
    </Segment>
  );
}
