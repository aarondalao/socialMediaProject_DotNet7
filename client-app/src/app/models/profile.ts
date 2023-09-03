import { User } from "./User";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string; 
    bio?: string;
    photos?: Photo[];
    followersCount: number;
    followingCount: number;
    isFollowing: boolean;
}

export class Profile implements IProfile {
    constructor(user: User) {
        this.username = user.username;
        this.displayName = user.displayName;
        this.image = user.image;
    }
    username: string;
    displayName: string;
    image?: string | undefined;
    bio?: string | undefined;
    photos?: Photo[] | undefined;
    followingCount = 0;
    followersCount = 0;
    isFollowing = false;
}
export interface Photo {
    id: string;
    url: string;
    isMain: boolean;
}