import { User } from "./User";

export interface IProfile {
    username: string;
    displayName: string;
    image?: string;
    bio?: string;
    photos?: Photo[];
    followersCount: number;
    followingCount:number;
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
    followersCount= 0;
    followingCount = 0;
    isFollowing = false;
}
export interface Photo{
    id: string;
    url: string;
    isMain: boolean;
}

export interface UserActivity{
    id: string;
    title: string;
    category: string;
    date: Date;    
}