import axios, {AxiosError} from 'axios';
import {getSession, signOut} from 'next-auth/react';

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
        async (error: AxiosError) => {
            // console.log(`error`, error);
            console.log(error?.response)
            if (error?.response?.status == 401) {
                await signOut()
            }
            return Promise.reject(error)
        },
    );

    return instance;
};

export default ApiClient();