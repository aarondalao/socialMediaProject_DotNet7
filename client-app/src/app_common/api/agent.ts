import axios, { AxiosError, AxiosResponse } from 'axios';
import { Activity } from '../models/activity';
import { toast } from 'react-toastify';
import { router } from '../router/Routes';
import { store } from '../stores/store';

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay)
    })
}

const responseBody = <Type>(response: AxiosResponse<Type>) => response.data;

axios.defaults.baseURL = 'http://localhost:5000/api';

// edited: 15/06/23 
axios.interceptors.response.use(async response => {
    await sleep(1000)
    return response;
}, (error: AxiosError) => {

    const { data, status } = error.response as AxiosResponse;

    switch (status) {
        case 400:
            if(data.errors){
                // refered to as " on our API"
                const modalStateErrors= [];
                for(const key in data.errors){
                    if(data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();

            }
            else{
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
    create: (activity: Activity) => axios.post<void>('/activities', activity),
    update: (activity: Activity) => axios.put<void>(`/activities/${activity.id}`, activity),
    delete: (id: string) => axios.delete<void>(`/activities/${id}`)
}

const agent = {
    Activities
}

export default agent;