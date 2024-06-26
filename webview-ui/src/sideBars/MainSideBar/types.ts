import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';
import { ELayoutTypes } from './enums';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { TConnection } from '../../../../src/helpers';

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

    setConnectionString: (value: string) => void;
    connectionString: string | undefined;

    savedConnections: TConnection[] | null;
    addConnection: (value: TConnection) => void;

    setIsLoggedInAzure: (value: boolean) => void;
    isLoggedInAzure: boolean;
}

export interface ILayoutContext {
    layoutType: ELayoutTypes;
    changeLayoutType: (value: ELayoutTypes) => void;
    hasHeader: boolean;
}

export interface IVSCodeInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}
