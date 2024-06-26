import { ELoginType } from './enums';

export type TMainSideBarPayload = undefined | string;

export type TConnection = {
    id: string;
    name: string;
    settings: TConnectionSettingsAzure;
};

export type TConnectionSettingsAzure = {
    loginType: ELoginType;
    subscriptionId?: string; // OAuth
    resourceGroupName?: string; // OAuth
    namespaceName?: string; // OAuth
    eventHubName?: string; // connectionString, OAuth
    consumerGroupName?: string; // connectionString, OAuth
    connectionString?: string; // connectionString
};
