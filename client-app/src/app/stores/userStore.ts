import { makeAutoObservable, runInAction } from "mobx"
import { User, UserFormValues } from "../models/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;
    refreshTokenTimeout?: number;

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn() {
        return !!this.user
    }

    login = async (credentials: UserFormValues) => {

        const user = await agent.Account.login(credentials);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        this.startRefreshTokenTimer(user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    logout = () => {
        store.commonStore.setToken(null);
        this.user = null;
        router.navigate("/");
    }

    getUser = async () => {
        try {
            const user = await agent.Account.current();
            runInAction(() => {
                this.user = user;
            });
            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log(error);
        }
    }

    register = async (credentials: UserFormValues) => {
        const user = await agent.Account.register(credentials);
        store.commonStore.setToken(user.token);
        runInAction(() => this.user = user);
        this.startRefreshTokenTimer(user);
        router.navigate('/activities');
        store.modalStore.closeModal();
    }

    setImage = (image: string) => {
        if (this.user) this.user.image = image;
    }

    setDisplayName = (dName: string) => {
        if (this.user) this.user.displayName = dName;
    }

    refreshToken = async () => {
        this.stopRefreshTokenTimer();

        try {

            const user = await agent.Account.refreshToken();
            
            runInAction(() => this.user = user);

            store.commonStore.setToken(user.token);

            this.startRefreshTokenTimer(user);
        } catch (error) {
            console.log("Somethings went wrong" + error);
        }
    }

    private stopRefreshTokenTimer() {
        clearTimeout(this.refreshTokenTimeout);
    }

    private startRefreshTokenTimer(user: User) {

        const jwtToken = JSON.parse(atob(user.token.split('.')[1]));

        const expires = new Date(jwtToken.exp * 1000);

        // expire.getTime is the expiration of the token minus the time now in 
        // milliseconds minus 60 seconds into milliseconds
        const timeout = expires.getTime() - Date.now() - (60 * 1000);

        this.refreshTokenTimeout = setTimeout(this.refreshToken, timeout) as unknown as number;

        console.log({refreshTimeout : this.refreshTokenTimeout});
    }
}