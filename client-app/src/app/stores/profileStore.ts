import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserActivity } from "../models/profile";
import { store } from "./store";

export default class ProfileStore {
    profile: Profile | null = null;
    loadingProfile = false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities: UserActivity[] = [];
    loadingActivities = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 3 || activeTab === 4) {
                    const followAction = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowings(followAction);
                }
                else {
                    this.followings = [];
                }
            }
        );
    }

    setActiveTab = (activeTab: number) => {
        this.activeTab = activeTab;
    }

    get isCurrentUser() {
        if (store.userStore.user && this.profile) {
            return store.userStore.user.username === this.profile.username;
        }
        return false;
    }

    loadProfile = async (username: string) => {

        this.loadingProfile = true;
        try {
            const profile = await agent.Profiles.get(username);

            runInAction(() => {
                this.profile = profile;
                this.loadingProfile = false;
            })
        } catch (error) {
            console.log(error);

            runInAction(() => this.loadingProfile = false);
        }
    }

    uploadPhoto = async (file: Blob) => {
        this.uploading = true;
        try {
            const response = await agent.Profiles.uploadPhoto(file);
            const photo = response.data;
            runInAction(() => {
                if (this.profile) {
                    this.profile.photos?.push(photo);
                    if (photo.isMain && store.userStore.user) {
                        store.userStore.setImage(photo.url);
                        this.profile.image = photo.url;
                    }
                }
                this.uploading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }

    setMainPhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.id);

            runInAction(() => {
                if (this.profile && this.profile.photos) {
                    this.profile.photos.find(p => p.isMain)!.isMain = false;
                    this.profile.photos.find(p => p.id === photo.id)!.isMain = true;
                    this.profile.image = photo.url;
                    this.loading = false;

                }
            })
        } catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }

    deletePhoto = async (photo: Photo) => {
        this.loading = true;

        try {
            await agent.Profiles.deletePhoto(photo.id);

            runInAction(() => {
                if (this.profile) {
                    this.profile.photos = this.profile.photos?.filter(
                        p => p.id !== photo.id
                    );
                    this.loading = false;
                }
            })


        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateProfile = async (profile: Partial<Profile>) => {
        this.loading = true;

        try {
            await agent.Profiles.updateProfile(profile);

            runInAction(() => {
                if (profile.displayName && profile.displayName !== store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile.displayName);
                }

                this.profile = { ...this.profile, ...profile as Profile };
                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => this.loading = false);
        }
    }

    updateFollowing = async (username: string, following: boolean) => {
        this.loading = true;

        try {
            await agent.Profiles.updateFollowing(username);
            store.activityStore.updateAttendeeFollowing(username);

            runInAction(() => {

                if (this.profile && this.profile.username !== store.userStore.user?.username
                    && this.profile.username === username) {
                    if (this.profile && this.profile.username === store.userStore.user?.username) {
                        following ? this.profile.followingCount++ : this.profile.followingCount--;
                    }

                    following ? this.profile.followersCount++ : this.profile.followersCount--;
                    this.profile.isFollowing = !this.profile.followingCount;
                }

                this.followings.forEach(profile => {
                    if (profile.username === username) {
                        profile.isFollowing ? profile.followersCount-- : profile.followersCount++;
                        profile.isFollowing = !profile.isFollowing;
                    }
                })

                this.loading = false;
            })
        } catch (error) {
            console.log(error);
            runInAction(() => {
                this.loading = false;
            });
        }
    }

    loadFollowings = async (followAction: string) => {
        this.loadingFollowings = true;

        try {
            const followingCollection = await agent.Profiles.listFollowing(this.profile!.username, followAction);

            runInAction(() => {
                this.followings = followingCollection;
                this.loadingFollowings = false;
            })
        } catch (error) {
            console.log(error)

            runInAction(() => {
                this.loadingFollowings = false;
            })
        }
    }

    loadUserActivities = async (username: string, eventConditions?: string) => {
        this.loadingActivities = true;

        try {
            const userActivitiesCollection = await agent.Profiles.listUserActivities(username, eventConditions!);

            runInAction(() => {
                this.userActivities = userActivitiesCollection;
                this.loadingActivities = false;
            });
        } catch (error) {
            console.log(`error loading the activities: ${error}`);

            runInAction(() => {
                this.loadingActivities = false;
            });
        }
    };
    
}