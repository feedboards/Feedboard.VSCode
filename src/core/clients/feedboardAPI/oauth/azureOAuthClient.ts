import { APICore } from '../../apiCore';

const client = new APICore();

export const getAzureLoginURI = async () => {
    return client.get('AzureOAuth/login-url', null);
};

export const getAzureTokens = async (code: string, state: string) => {
    return await client.get('AzureOAuth/process-code', { code, state });
};

export const updateAzureAccessToken = async (refreshToken: string) => {
    return await client.get('AzureOAuth/update-access-token', { refreshToken });
};
