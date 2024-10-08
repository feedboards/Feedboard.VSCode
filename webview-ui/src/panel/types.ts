import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { ReactNode } from 'react';
import { TConnection } from '@feedboard/feedboard.core';

export enum ELayoutTypes {
    withAzureOAuth = 'withAzureOAuth',
    withConnectionString = 'withConnectionString',
    withMQTT = 'withMQTT',
}

export interface IContextProviderProps {
    children: ReactNode;
}

export interface IGlobalContext {
    setEventHubs: (value: Eventhub[]) => void;
    setEventHubLoading: (value: boolean) => void;
    setSelectedEventHub: (value: Eventhub | undefined) => void;
    setEventHubNameConnectionString: (value: string) => void;
    eventHubs: Eventhub[] | undefined;
    eventHubLoading: boolean;
    selectedEventHub: Eventhub | undefined;
    eventHubNameConnectionString: string | undefined;

    setConsumerGroups: (value: ConsumerGroup[]) => void;
    setConsumerGroupLoading: (value: boolean) => void;
    setSelectedConsumerGroups: (value: ConsumerGroup | undefined) => void;
    setConsumerGroupNameConnectionString: (value: string) => void;
    consumerGroups: ConsumerGroup[] | undefined;
    consumerGroupLoading: boolean;
    selectedConsumerGroups: ConsumerGroup | undefined;
    consumerGroupNameConnectionString: string | undefined;

    setMessages: (value: any[] | undefined) => void;
    setMessageLoading: (value: boolean) => void;
    setSelectedMessages: (value: any | undefined) => void;
    messages: any[] | undefined;
    messageLoading: boolean;
    selectedMessage: any | undefined;

    topic: string | undefined;
    setTopic: (value: string) => void;

    setIsLoggedInAzure: (value: boolean) => void;
    isLoggedInAzure: boolean;

    connection: TConnection | undefined;
}

export interface ILayoutContext {
    changeLayoutType: (type: ELayoutTypes) => void;
    layoutType: ELayoutTypes;
}
