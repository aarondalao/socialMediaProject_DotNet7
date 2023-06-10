// import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { makeAutoObservable } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
export default class ActivityStore {
    // Practice run : IGNORE
    // title = "Hello from MobX";
    activities: Activity[] = [];
    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;

    constructor() {
        // can do this
        // makeObservable(this, {
        //     title : observable,
        //     setTitle: action
        // })

        // or this. albeit too abstracted
        makeAutoObservable(this)
    }

    // Practice run : IGNORE
    // either use arrow function in this setTitle or insert at setTitle: action.bound 
    // to bind setTitle function to the ActivityStore Class
    // setTitle = () => {
    //     this.title = this.title + "!"
    // }

    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            // activities from API
            const activities = await agent.Activities.list();

            // this creates a temporary action that is immediately called.
            // very useful for asynchronous processes

            activities.forEach(activity => {

                // mutate the state activity by spliting the date starting from T 
                // and then take the first element from that array
                // finally push the first element to the activities array
                activity.date = activity.date.split('T')[0];
                this.activities.push(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);

            this.setLoadingInitial(false);
        }
    }

    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    selectActivity = (id:string) => {
        this.selectedActivity = this.activities.find(a => a.id === id);
    }

    cancelSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    openForm = (id?: string) => {
        console.log('im in open form now')
        id ? this.selectActivity(id) : this.cancelSelectedActivity();
        this.editMode = true;
    }

    closeForm = () => {
        this.editMode = false;
    }
}