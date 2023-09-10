import { Link } from 'react-router-dom';
import { Button, Header, Icon, Segment } from 'semantic-ui-react';

export default function NotFound(){
    return (
        <Segment placeholder>
            <Header icon>
                <Icon name='search' />
                    Oops - looks like you're in a wrong page. We've looked everywhere but could not find what you're looking for!
                
            </Header>
            <Segment.Inline>
                <Button as={Link} to='/activities' content='Return to activities page'/>
            </Segment.Inline>
        </Segment>
    );
}