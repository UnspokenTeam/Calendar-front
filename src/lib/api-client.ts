import axios from 'axios';
import {getSession} from 'next-auth/react';

const baseURL = "http://127.0.0.1:8000";

const ApiClient = () => {
    const defaultOptions = {
        baseURL,
        timeout: 5000
    };

    const instance = axios.create(defaultOptions);

    instance.interceptors.request.use(async (request) => {
        const session = await getSession();
        if (session) {
            request.headers.Authorization = `Bearer ${session.user.access_token}`;
        }
        return request;
    });

    instance.interceptors.response.use(
        (response) => {
            return response;
        },
        (error) => {
            console.log(`error`, error);
        },
    );

    return instance;
};

export default ApiClient();