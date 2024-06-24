import { ConsumerGroup, EHNamespace, Eventhub } from '@azure/arm-eventhub';
import { ResourceGroup } from '@azure/arm-resources';
import { Subscription } from '@azure/arm-subscriptions';
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode } from 'react';
import { ELayoutTypes } from '.';

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

    setEventHubs: (value: Eventhub[]) => void;
    setEventHubLoading: (value: boolean) => void;
    setSelectedEventHub: (value: Eventhub | undefined) => void;
    eventHubs: Eventhub[] | undefined;
    eventHubLoading: boolean;
    selectedEventHub: Eventhub | undefined;

    setConsumerGroups: (value: ConsumerGroup[]) => void;
    setConsumerGroupLoading: (value: boolean) => void;
    consumerGroups: ConsumerGroup[] | undefined;
    consumerGroupLoading: boolean;

    setMessages: (value: any[] | undefined) => void;
    setMessageLoading: (value: boolean) => void;
    setSelectedMessages: (value: any | undefined) => void;
    messages: any[] | undefined;
    messageLoading: boolean;
    selectedMessage: any | undefined;

    setIsLoggedInAzure: (value: boolean) => void;
    isLoggedInAzure: boolean;
}

export interface ILayoutContext {
    changeLayoutType: (type: ELayoutTypes) => void;
    layoutType: ELayoutTypes;
}

export interface IPanelWithConnectionString {
    half?: boolean;
}

export interface IVSCodeInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {}
