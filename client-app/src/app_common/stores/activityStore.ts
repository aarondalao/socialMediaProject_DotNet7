// import { action, makeAutoObservable, makeObservable, observable } from "mobx";
import { makeAutoObservable } from "mobx";

export default class ActivityStore{
    title = "Hello from MobX";

    constructor(){
        // can do this
        // makeObservable(this, {
        //     title : observable,
        //     setTitle: action
        // })

        // or this. albeit too abstracted
        makeAutoObservable(this)
    }

    // either use arrow function in this setTitle or insert at setTitle: action.bound 
    // to bind setTitle function to the ActivityStore Class
    setTitle = () => {
        this.title = this.title + "!"
    }
}