import {
    ELoginType,
    TConnectionSettingsAzureConnectionString,
    TConnectionSettingsAzureOAuth,
} from '../../../../src/helpers';

export const isOAuthType = (obj: any): obj is TConnectionSettingsAzureOAuth => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.oAuth;
};

export const isConnectionString = (obj: any): obj is TConnectionSettingsAzureConnectionString => {
    return obj && typeof obj === 'object' && obj.loginType === ELoginType.connectionString;
};
