/*
notes:

    storing JWT Token in local storage is insecure
    weakness include:
    1) XXS attacks - JavaScript can access localStorage. This requires the attackiner to execute malicious JavaScript on the application
    2) Local Machine Priviledges - Anyone how has admin access can access localStorage for another user account.

    if an attacher can run malicious javascript on your application then JWT stored in local storage is the least of your problems. 
    this is what we will address later
*/ 

import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore{
    error: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);
    
        reaction(
            () =>this.token,
            token => {
                // TODO: saving tokens in a local storage is a security risk right here. research about reduce risk 
                if(token){
                    localStorage.setItem('jwt', token);
                }
                else {
                    localStorage.removeItem('jwt');
                }
            },
        )
    }

    setServerError(error: ServerError){
        this.error = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setAppLoaded = () => {
        this.appLoaded = true;
    }
}