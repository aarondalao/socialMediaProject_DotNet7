import axios, { AxiosResponse } from 'axios';
import { Activity } from '../models/activity';

axios.defaults.baseURL = 'http://localhost:5000/api';

const responseBody= <Type> (response: AxiosResponse<Type>) => response.data;

const requests = {
    get:  <Type>(url : string) => axios.get<Type>(url).then(responseBody),
    post: <Type> (url : string,body: {}) => axios.post<Type>(url,body).then(responseBody),
    put: <Type>(url : string, body: {}) => axios.put<Type>(url,body).then(responseBody),
    del: <Type>(url : string) => axios.delete<Type>(url).then(responseBody),
}

const Activities = {
    list: () => requests.get<Activity[]>('/activities')
}

const agent = {
    Activities
}

export default agent;