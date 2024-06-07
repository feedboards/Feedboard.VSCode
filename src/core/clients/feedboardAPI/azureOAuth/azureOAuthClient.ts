import { APICore } from "../../apiCore";

const client = new APICore();

export const getAzureLoginURI = () => {
    return client.get('AzureOAuth/login-url', null);
};

export const getAzureTokens = (code: string, state: string) => {
    return client.get('AzureOAuth/process-code',  { code, state });
};

export const updateAzureAccessToken = (refreshToken: string) => {
    return client.get('AzureOAuth/update-access-token', { refreshToken });
};