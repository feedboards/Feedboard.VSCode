import { APICore } from "../../apiCore";

const client = new APICore();

export const getLoginURI = () => {
    return client.get('AzureOAuth/login-url', null);
};

export const getTokens = (code: string, state: string) => {
    return client.get(`AzureOAuth/process-code?code=${code}$state=${state}`, null);
};

export const updateAccessToken = (refreshToken: string) => {
    return client.get(`AzureOAuth/update-access-token?refreshToken=${refreshToken}`, null);
};