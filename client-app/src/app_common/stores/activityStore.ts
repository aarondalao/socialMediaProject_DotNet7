// import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { makeAutoObservable, runInAction } from "mobx";
import { Activity } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';

export default class ActivityStore {
    // Practice run : IGNORE
    // title = "Hello from MobX";

    // storing activity in the client app as an array
    // activities: Activity[] = [];

    // storing activity in the client app as a key|value pair called maps
    activityRegistry = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = true;

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

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values()).sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
    }

    // get all activities
    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            // activities from API
            const activities = await agent.Activities.list();

            activities.forEach(activity => {
                this.setActivity(activity);
            })
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);

            this.setLoadingInitial(false);
        }
    }

    // either get a single activity from memory or from the API
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) this.selectedActivity = activity
        else {
            this.setLoadingInitial(true);

            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                this.selectedActivity = activity;
                this.setLoadingInitial(false);
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    private setActivity = (activity: Activity) => {

        runInAction(() => {
            // mutate the state activity by spliting the date starting from T 
            // and then take the first element from that array
            // finally push the first element to the activities array
            activity.date = activity.date.split('T')[0];

            // array method
            // this.activities.push(activity);

            // map method
            this.activityRegistry.set(activity.id, activity);

        })
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // responsible for the loading indicator as soon as you load the page initially
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: Activity) => {
        this.loading = true;
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);

            // runInAction -> this creates a temporary action that is immediately called.
            // very useful for asynchronous processes
            runInAction(() => {
                // array method
                // this.activities.push(activity);

                // map method
                this.activityRegistry.set(activity.id, activity)

                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    updateActivity = async (activity: Activity) => {
        this.loading = true;
        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                // this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];

                // array methods 
                // this.activities.filter(x => x.id !== activity.id);
                // this.activities.push(activity);

                // map methods
                this.activityRegistry.set(activity.id, activity);

                this.selectedActivity = activity;
                this.editMode = false;
                this.loading = false;
            })
        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            })
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
                // array method
                // this.activities = [...this.activities.filter(x => x.id !== id)];

                // map method
                this.activityRegistry.delete(id);
                this.loading = false;
            })

        } catch (error) {
            console.log(error)
            runInAction(() => {
                this.loading = false;
            });
        }
    }
}
