import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve,delay)
    })
}

axios.defaults.baseURL = 'http://localhost:5000/api';

// TODO: convert to async instead of using promise -> then chaining
axios.interceptors.response.use(response => {
    return sleep(1000).then(() => {
        return response;
    }).catch((error) => {
        console.log(error);
        return Promise.reject(error);
    })
});

const responseBody= <Type> (response: AxiosResponse<Type>) => response.data;

const requests = {
    get:  <Type>(url : string) => axios.get<Type>(url).then(responseBody),
    post: <Type> (url : string,body: {}) => axios.post<Type>(url,body).then(responseBody),
    put: <Type>(url : string, body: {}) => axios.put<Type>(url,body).then(responseBody),
    del: <Type>(url : string) => axios.delete<Type>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities'),
    details: (id :string) => requests.get<Activity>(`/activities/${id}`),
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id:string) => axios.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;