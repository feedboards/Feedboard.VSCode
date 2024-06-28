import { ELoginType } from './enums';

export type TMainSideBarPayload = undefined | string;

export type TConnection = {
    id: string;
    name: string;
    settings: TConnectionSettingsAzureConnectionString | TConnectionSettingsAzureOAuth;
};

export type TConnectionSettingsAzure = {
    loginType: ELoginType;
};

export type TConnectionSettingsAzureConnectionString = TConnectionSettingsAzure & {
    connectionString?: string;
};

export type TConnectionSettingsAzureOAuth = TConnectionSettingsAzure & {
    subscription: TSubscription;
    resourceGroup: TData;
    namespace: TData;
    eventHub: TData;
    consumerGroup: TData;
};

type TSubscription = {
    readonly subscriptionId?: string;
    readonly displayName?: string;
    readonly tenantId?: string;
};

type TData = {
    readonly id?: string;
    readonly name?: string;
};
