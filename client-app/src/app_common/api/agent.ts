import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { toast } from 'react-toastify';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

const responseBody = <Type>(response: AxiosResponse<Type>) => response.data;

axios.defaults.baseURL = 'http://localhost:5000/api';

// TODO: convert to async instead of using promise -> then chaining, if possible
// edited: 15/06/23
axios.interceptors.response.use(async response => {
    await sleep(1000)
    return response;
}, (error: AxiosError) => {
    const { data, status } = error.response!;
    switch (status) {
        case 400:
            toast.error("bad request");
            break;
        case 401:
            toast.error("unauthorized");
            break;
        case 403:
            toast.error("forbidden");
            break;
        case 404:
            toast.error("not found");
            break;
        case 500:
            toast.error("Internal Server Error");
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
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;