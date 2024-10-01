import { ReactNode } from 'react';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { TConnection } from '@feedboard/feedboard.core';

export enum ELayoutTypes {
    connectionList = 'connectionList',
    addOrEditConnection = 'addOrEditConnection',
    settings = 'settings',
}

export interface IContextProviderProps {
    children: ReactNode;
}

export interface IGlobalContext {
    setSubscriptions: (value: Subscription[]) => void;
    setSubscriptionLoading: (value: boolean) => void;
    setSelectedSubscription: (value: Subscription | undefined) => void;
    subscriptions: Subscription[] | undefined;
    subscriptionLoading: boolean;
    selectedSubscription: Subscription | undefined;

    setResourceGroups: (value: ResourceGroup[]) => void;
    setResourceGroupLoading: (value: boolean) => void;
    setSelectedResourceGroup: (value: ResourceGroup | undefined) => void;
    resourceGroups: ResourceGroup[] | undefined;
    resourceGroupLoading: boolean;
    selectedResourceGroup: ResourceGroup | undefined;

    setNamespaces: (value: EHNamespace[]) => void;
    setNamespaceLoading: (value: boolean) => void;
    setSelectedNamespace: (value: EHNamespace | undefined) => void;
    namespaces: EHNamespace[] | undefined;
    namespaceLoading: boolean;
    selectedNamespace: EHNamespace | undefined;

    savedConnections: TConnection[] | null;
    addConnection: (connection: TConnection) => void;
    removeConnection: (connection: TConnection) => void;

    setIsLoggedInAzure: (value: boolean) => void;
    isLoggedInAzure: boolean;

    baseAPIUrl: string | undefined;
    setBaseAPIUrl: (value: string) => void;
}

export interface ILayoutContext {
    layoutType: ELayoutTypes;
    changeLayoutType: (value: ELayoutTypes) => void;
    hasHeader: boolean;
}

export interface IAddNewConnectionOAuth {
    subscriptionsError: boolean;
    resourceGroupsError: boolean;
    namespacesError: boolean;
    setSubscriptionsError: (value: boolean) => void;
    setResourceGroupsError: (value: boolean) => void;
    setNamespacesError: (value: boolean) => void;
    connection?: TConnection;
}

export interface IEditAndAddNewConnection extends IConnectionList {
    connection?: TConnection;
}

export interface IConnectionList {
    setConnection: (value: TConnection | undefined) => void;
}
