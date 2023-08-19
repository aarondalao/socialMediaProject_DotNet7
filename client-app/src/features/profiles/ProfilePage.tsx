import { Grid } from "semantic-ui-react";
import ProfileHeader from "./ProfileHeader";
import ProfileContent from "./ProfileContent";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingComponent from "../../app/layout/LoadingComponent";
import { useStore } from "../../app/stores/store";

export default observer(function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { profileStore } = useStore();
  const { loadingProfile, loadProfile, profile } = profileStore;

  useEffect(() => {
    if (username) loadProfile(username);
  }, [loadProfile, username]);

  if (loadingProfile)
    return <LoadingComponent content="Loading user profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        {
            profile && <ProfileHeader profile={profile} />
        }
      </Grid.Column>
      <Grid.Column width={16}>
        {
          profile && <ProfileContent profile={profile} />
        }
      </Grid.Column>
    </Grid>
  );
});