/*
    agent.ts

    this handles requests to be fetched by the controller api, 
    and the error handling being thrown by the controller api

    
*/
import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity, ActivityFormValues } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';
import { User, UserFormValues } from '../models/User';
import { Photo, Profile, UserActivity } from '../models/profile';
import { PaginatedResult } from '../models/pagination';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

const responseBody = <Type>(response: AxiosResponse<Type>) => response.data;

// every requests the client does this interceptor will run
// if the client has a token, it will attach that token into config.headers.Authorization
axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

// TODO: if possible, convert line 19-68 into async -await instead of promise -> then chaining
// edited: 15/06/23 
axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(1000);

    // added : 6/9/2023
    const pagination = response.headers["pagination"];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<unknown>>
    }

    return response;

}, (error: AxiosError) => {

    const { data, status, config, headers } = error.response as AxiosResponse;

    switch (status) {
        case 400:

            // check if what we're getting is a get request
            if (config.method === 'get' &&
                Object.prototype.hasOwnProperty.call(data.errors, 'id')) {
                router.navigate('not-found');
            }

            if (data.errors) {
                // refered to as " on our API"
                const modelStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modelStateErrors.push(data.errors[key])
                    }
                }
                throw modelStateErrors.flat();

            }
            else {
                toast.error(data);
            }
            break;
        case 401:
            if (status === 401 && headers['www-authenticate']?.startsWith("Bearer error='invalid_token'")) {
                store.userStore.logout();
                toast.error('Session expired - Please login again');
            }
            else {
                toast.error('Unauthorised');
            }
            break;
        case 403:
            toast.error("forbidden");
            break;
        case 404:
            router.navigate('/not-found');
            // toast.error("not found");
            break;
        case 500:
            // toast.error("Internal Server Error");

            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }

    return Promise.reject(error);
});


const requests = {
    get: <Type>(url: string) => axios.get<Type>(url).then(responseBody),
    post: <Type>(url: string, body: object) => axios.post<Type>(url, body).then(responseBody),
    put: <Type>(url: string, body: object) => axios.put<Type>(url, body).then(responseBody),
    del: <Type>(url: string) => axios.delete<Type>(url).then(responseBody),
}

const Activities = {

    // edited: 7/9/23
    list: (params: URLSearchParams) => axios.get<PaginatedResult<Activity[]>>('/activities', { params })
        .then(responseBody),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`, {})
}

const Account = {
    current: () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user),
    register: (user: UserFormValues) => requests.post<User>('/account/register', user),
    refreshToken: () => requests.post<User>('/account/refreshToken', {}),
    verifyEmail: (token: string, email:string) => requests.post<void>(`/account/verifyEmail?token=${token}&email=${email}`,{}),
    resendEmailConfirm: (email: string) => requests.get(`/account/resendEmailConfirmationLink?email=${email}`),
    fbLogin: (accessToken: string) =>requests.post<User>(`/account/fbLogin?accessToken=${accessToken}`,{})
}

const Profiles = {
    get: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        const formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        })
    },
    setMainPhoto: (id: string) => requests.post(`/photos/${id}/setMain`, {}),
    deletePhoto: (id: string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`, profile),
    updateFollowing: (username: string) => requests.post(`/follow/${username}`, {}),
    listFollowing: (username: string, followAction: string) =>
        requests.get<Profile[]>(`/follow/${username}?followAction=${followAction}`),
    listUserActivities: (username: string, eventConditions: string) =>
        requests.get<UserActivity[]>(`profiles/${username}/activities?eventConditions=${eventConditions}`)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;