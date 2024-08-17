export type TConnection = {
    id: string;
    name: string;
    settings: TConnectionSettingsAzureConnectionString | TConnectionSettingsAzureOAuth;
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

export type TConnectionSettingsAzure = {
    loginType: ELoginType;
};

export enum ELoginType {
    azureOAuth = 'azureOAuth',
    connectionString = 'connectionString',
}

type TSubscription = {
    readonly subscriptionId?: string;
    readonly displayName?: string;
    readonly tenantId?: string;
};

type TData = {
    readonly id?: string;
    readonly name?: string;
};
