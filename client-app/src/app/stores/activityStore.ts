// import { action, makeAutoObservable, makeObservable, observable } from "mobx";

import { makeAutoObservable, reaction, runInAction } from "mobx";
import { Activity, ActivityFormValues } from "../models/activity";
import agent from "../api/agent";
import { v4 as uuid } from 'uuid';
import { store } from "./store";
import { Profile } from "../models/profile";
import { Pagination, PagingParams } from "../models/pagination";

export default class ActivityStore {
    activityRegistry = new Map<string, Activity>();

    selectedActivity: Activity | undefined = undefined;
    editMode = false;
    loading = false;
    loadingInitial = false;
    pagination: Pagination | null = null;
    pagingParameters = new PagingParams();
    filterActions = new Map().set('all', true);


    constructor() {
        makeAutoObservable(this)

        reaction(
            () => this.filterActions.keys(),
            () => {
                this.pagingParameters = new PagingParams();
                this.activityRegistry.clear();
                this.loadActivities();
            }
        );
    }

    setPagingParameters = (pagingParameters: PagingParams) => {
        this.pagingParameters = pagingParameters;
    }

    setFilters = ( filterAction: string, filterValue: string | Date) => {
        const resetFilterActions = () => {
            this.filterActions.forEach((value, key) => {
                if(key !== 'startDate') this.filterActions.delete(key);
            })
        }
        switch (filterAction)
        {
            case 'all':
                resetFilterActions();
                this.filterActions.set('all', true);
                break;
            case 'isGoing':
                resetFilterActions();
                this.filterActions.set('isGoing', true);
                break;
            case 'isHost':
                resetFilterActions();
                this.filterActions.set('isHost', true);
                break;
            case 'startDate':
                this.filterActions.delete('startDate');
                this.filterActions.set('startDate', filterValue);
        }
    }

    // this modifies the headers needed to either filter or to paginate the activities
    get axiosParameters () {
        const params = new URLSearchParams();
        params.append('pageNumber', this.pagingParameters.pageNumber.toString());
        params.append('pageSize', this.pagingParameters.pageSize.toString());
        

        this.filterActions.forEach((value,key) => {
            if(key === 'startDate') {
                params.append(key, (value as Date).toISOString())
            }
            else{
                params.append(key,value);
            }
        })

        return params;
    }

    get activitiesByDate() {
        return Array.from(this.activityRegistry.values())
            .sort((a, b) => a.date!.getTime() - b.date!.getTime());
    }

    get groupedActivities() {
        return Object.entries(
            this.activitiesByDate.reduce((activities, activity) => {
                const date = activity.date!.toISOString().split('T')[0];
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as { [key: string]: Activity[] })
        )
    }

    // get all activities. edited 6/9/2023
    loadActivities = async () => {
        this.setLoadingInitial(true);
        try {
            // activities from API
            const result = await agent.Activities.list(this.axiosParameters);

            result.data.forEach(activity => {
                this.setActivity(activity);
            })
            this.setPagination(result.pagination);
            this.setLoadingInitial(false);
        } catch (error) {
            console.log(error);
            this.setLoadingInitial(false);
        }
    }

    // set pagination
    setPagination = (pagination : Pagination) => {
        this.pagination = pagination;
    }


    // either get a single activity from memory or from the API
    loadActivity = async (id: string) => {
        let activity = this.getActivity(id);

        if (activity) {
            this.selectedActivity = activity
            return activity;
        }
        else {
            this.setLoadingInitial(true);

            try {
                activity = await agent.Activities.details(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                })

                this.setLoadingInitial(false);
                return activity
            } catch (error) {
                console.log(error)
                this.setLoadingInitial(false)
            }
        }
    }

    private setActivity = (activity: Activity) => {
        const user = store.userStore.user;

        if (user) {
            activity.isGoing = activity.attendees!.some(
                a => a.username === user.username
            )
        }

        activity.isHost = activity.hostUsername === user!.username;
        activity.host = activity.attendees?.find(x => x.username === activity.hostUsername);
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }

    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }

    // responsible for the loading indicator as soon as you load the page initially
    setLoadingInitial = (state: boolean) => {
        this.loadingInitial = state;
    }

    createActivity = async (activity: ActivityFormValues) => {
        const user = store.userStore.user;
        const attendee = new Profile(user!);
        activity.id = uuid();
        try {
            await agent.Activities.create(activity);
            const newActivity = new Activity(activity);
            newActivity.hostUsername = user!.username;
            newActivity.attendees = [attendee];
            this.setActivity(newActivity);

            // runInAction -> this creates a temporary action that is immediately called.
            // very useful for asynchronous processes
            runInAction(() => {
                this.selectedActivity = newActivity;
            })
        } catch (error) {
            console.log(error)
        }
    }

    updateActivity = async (activity: ActivityFormValues) => {
        try {
            await agent.Activities.update(activity);

            runInAction(() => {
                // this.activities = [...this.activities.filter(x => x.id !== activity.id), activity];

                if(activity.id) {
                    let updatedActivity = {...this.getActivity(activity.id), ...activity}
                    this.activityRegistry.set(activity.id, updatedActivity as Activity);
                    this.selectedActivity = updatedActivity as Activity;
                }
            })
        } catch (error) {
            console.log(error)
        }
    }

    deleteActivity = async (id: string) => {
        this.loading = true;

        try {
            await agent.Activities.delete(id);

            runInAction(() => {
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

    updateAttendance = async () => {
        const user = store.userStore.user;
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(() => {
                if (this.selectedActivity?.isGoing) {
                    this.selectedActivity.attendees = this.selectedActivity.attendees?.filter(a => a.username !== user?.username);
                    this.selectedActivity.isGoing = false;
                }
                else{
                    const attendee = new Profile(user!);
                    this.selectedActivity?.attendees?.push(attendee);
                    this.selectedActivity!.isGoing = true;
                }

                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error)
        }
        finally {
            runInAction(() => this.loading = false);
        }
    }

    cancelActivityToggle = async () => {
        this.loading = true;

        try {
            await agent.Activities.attend(this.selectedActivity!.id);

            runInAction(() => {
                this.selectedActivity!.isCancelled = !this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id, this.selectedActivity!);
            })
        } catch (error) {
            console.log(error)
        }
        finally{
            runInAction(() => this.loading = false)
        }
    }

    // added this 21/08 comments
    clearSelectedActivity = () => {
        this.selectedActivity = undefined;
    }

    updateAttendeeFollowing = (username : string) => {
        this.activityRegistry.forEach(activity => {
            activity.attendees.forEach( attendee => {
                if(attendee.username === username ){
                    attendee.isFollowing ? attendee.followersCount-- : attendee.followersCount++ ;
                    attendee.isFollowing = !attendee.isFollowing;
                }
            })
        })
    }
}
