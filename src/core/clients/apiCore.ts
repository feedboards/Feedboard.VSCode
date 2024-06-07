import * as constants from "../../constants/APIRouts";
import axios, { AxiosResponse } from "axios";

export class APICore {
    constructor() {
        this.configAxios();
    }

    public get (endpoint: string, params: any): Promise<AxiosResponse<any, any>> {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
            response = axios.get(`${constants.baseAPIURI}/${endpoint}?${queryString}`, params);
        } else {
            response = axios.get(`${constants.baseAPIURI}/${endpoint}`, params);
        }
        return response;
    };

    public getFile (endpoint: string, params: any): Promise<AxiosResponse<any, any>> {
        let response;
        if (params) {
            var queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
            response = axios.get(`${constants.baseAPIURI}/${endpoint}?${queryString}`, { responseType: 'blob' });
        } else {
            response = axios.get(`${constants.baseAPIURI}/${endpoint}`, { responseType: 'blob' });
        }
        return response;
    };

    public getMultiple(endpoints: string, params: any): Promise<AxiosResponse<any, any>[]> {
        const reqs = [];
        let queryString = '';
        if (params) {
            queryString = params
                ? Object.keys(params)
                      .map((key) => key + '=' + params[key])
                      .join('&')
                : '';
        }

        for (const endpoint of endpoints) {
            reqs.push(axios.get(`${constants.baseAPIURI}/${endpoint}?${queryString}`));
        }
        return axios.all(reqs);
    };

    public post<R = AxiosResponse<any>> (endpoint: string, data: any): Promise<R> {
        return axios.post(`${constants.baseAPIURI}/${endpoint}`, data);
    };

    public updatePatch<R = AxiosResponse<any>> (endpoint: string, data: any): Promise<R> {
        return axios.patch(`${constants.baseAPIURI}/${endpoint}`, data);
    };

    public put<R = AxiosResponse<any>> (endpoint: string, data: any): Promise<R> {
        return axios.put(`${constants.baseAPIURI}/${endpoint}`, data);
    };

    public delete<R = AxiosResponse<any>> (endpoint: string): Promise<R> {
        return axios.delete(`${constants}/${endpoint}`);
    };

    public createWithFile<R = AxiosResponse<any>> (endpoint: string, data: any): Promise<R> {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config: any = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.post(`${constants.baseAPIURI}/${endpoint}`, formData, config);
    };

    public updateWithFile<R = AxiosResponse<any>> (endpoint: string, data: any): Promise<R> {
        const formData = new FormData();
        for (const k in data) {
            formData.append(k, data[k]);
        }

        const config: any = {
            headers: {
                ...axios.defaults.headers,
                'content-type': 'multipart/form-data',
            },
        };
        return axios.patch(`${constants.baseAPIURI}/${endpoint}`, formData, config);
    };

    private configAxios(): void {
        // content type
        axios.defaults.headers.post['Content-Type'] = 'application/json';

        // intercepting to capture errors
        axios.interceptors.response.use(
            response => {
                return response;
            },
            error => {
                // Any status codes that falls outside the range of 2xx cause this function to trigger
                let message;

                switch (error.response.status) {
                    case 401:
                        message = 'Invalid credentials';
                        break;
                    case 403:
                        message = 'Access Forbidden';
                        break;
                    case 404:
                        message = 'Sorry! the data you are looking for could not be found';
                        break;
                    default: {
                        message =
                            error.response && error.response.data ? error.response.data['message'] : error.message || error;
                    }
                }

                return Promise.reject(message);
            }
        );
    }
};
