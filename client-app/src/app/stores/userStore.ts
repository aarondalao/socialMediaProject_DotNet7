import { makeAutoObservable } from "mobx"
import { User, UserFormValues } from "../models/User";
import agent from "../api/agent";

export default class UserStore {
    user: User | null = null

    constructor() {
        makeAutoObservable(this);
    }

    get isLoggedIn(){
        return !!this.user
    }

    login = async (credentials: UserFormValues) => {
        try{
            const user = await agent.Account.login(credentials);
            console.log(user); 
        }
        catch(error){
            throw error;
        }
    }
}