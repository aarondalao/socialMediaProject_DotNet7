import { toast } from "react-toastify";
import agent from "../../app/api/agent";
import useQuery from "../../app/util/hooks";
import { Button, Header, Icon, Segment } from "semantic-ui-react";

export default function RegisterSuccess() {
    const email = useQuery().get('email') as string;

    function handleConfirmEmailResend() {
        agent.Account.resendEmailConfirm(email).then(() => {
            toast.success("Verification email resent - please check your email in either the primary or spam folder");
        }).catch( error => console.log(error))
    }

    return(
        <Segment placeholder textAlign='center'>
            <Header icon color="green">
                <Icon name="check"/>
            </Header>
            <p>Please check your email (including junk/spam email) for the verification email</p>
            {email &&
                <>
                    <p>Didn't receive the email? Click the below button to resend</p>
                    <Button primary onClick={handleConfirmEmailResend} content="Resend Email" size="huge"/>
                </>
            }
        </Segment>
    );
}