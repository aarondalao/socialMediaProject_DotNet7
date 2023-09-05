import { observer } from "mobx-react-lite";
import { SyntheticEvent } from "react";
import { Profile } from "../../app/models/profile";
import { Button, Reveal } from "semantic-ui-react";
import { useStore } from "../../app/stores/store";

interface Props {
  profile: Profile;
}

export default observer(function FollowButton({ profile }: Props) {

    const { profileStore, userStore } = useStore();
    const { loading, updateFollowing } = profileStore;

    if(userStore.user?.username === profile.username) return null;

    function handleFollow(e: SyntheticEvent, username: string){
        e.preventDefault();
        profile.isFollowing ? updateFollowing(username, false) : updateFollowing(username, true);
    }

  return (
    <Reveal animated="move">
      <Reveal.Content visible style={{ width: "100%" }}>
        <Button fluid color="teal" content={ profile.isFollowing ? 'following' : 'not following' } />
      </Reveal.Content>
      <Reveal.Content hidden style={{ width: "100%" }}>
        <Button
        loading={loading}
          fluid
          basic
          color={profile.isFollowing ? "red" : "green"}
          content={profile.isFollowing ? "Unfollow" : "Follow"}
          onClick={(e) => handleFollow(e, profile.username)}
        />
      </Reveal.Content>
    </Reveal>
  );
});
