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
import { Photo, Profile } from '../models/profile';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody = <Type>(response: AxiosResponse<Type>) => response.data;

// every requests the client does this interceptor will run
// if the client has a token, it will attach that token into config.headers.Authorization
axios.interceptors.request.use(config=>{
    const token = store.commonStore.token;
    if( token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

// TODO: if possible, convert line 19-68 into async -await instead of promise -> then chaining
// edited: 15/06/23 
axios.interceptors.response.use(async response => {
    await sleep(1000)
    return response;
}, (error: AxiosError) => {

    const { data, status, config } = error.response as AxiosResponse;

    switch (status) {
        case 400:

            // check if what we're getting is a get request
            if (config.method === 'get' && data.errors.hasOwnProperty('id')) {
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
            toast.error("unauthorized");
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
    post: <Type>(url: string, body: {}) => axios.post<Type>(url, body).then(responseBody),
    put: <Type>(url: string, body: {}) => axios.put<Type>(url, body).then(responseBody),
    del: <Type>(url: string) => axios.delete<Type>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id: string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: ActivityFormValues) => requests.post<void>('/activities', activity),
    update: (activity: ActivityFormValues) => requests.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => requests.del<void>(`/activities/${id}`),
    attend: (id: string) => requests.post<void>(`/activities/${id}/attend`,{})
}

const Account = {
    current : () => requests.get<User>('/account'),
    login: (user: UserFormValues) => requests.post<User>('/account/login', user), 
    register: (user: UserFormValues) => requests.post<User>('/account/register', user)
}

const Profiles = {
    get: (username: string ) => requests.get<Profile>(`/profiles/${username}`),
    uploadPhoto: (file: Blob) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>('photos', formData, {
            headers: {'Content-Type': 'multipart/form-data'}
        }) 
    },
    setMainPhoto: (id:string) => requests.post(`/photos/${id}/setMain`,{}),
    deletePhoto: (id:string) => requests.del(`/photos/${id}`),
    updateProfile: (profile: Partial<Profile>) => requests.put(`/profiles`,profile)
}

const agent = {
    Activities,
    Account,
    Profiles
}

export default agent;