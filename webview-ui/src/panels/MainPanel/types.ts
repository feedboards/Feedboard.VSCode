import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { DetailedHTMLProps, InputHTMLAttributes, ReactNode, SVGProps } from 'react';
import { ELayoutTypes } from '.';
import { TConnection } from '../../../../src/helpers';

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

    setIsLoggedInAzure: (value: boolean) => void;
    isLoggedInAzure: boolean;

    connection: TConnection | undefined;
}

export interface ILayoutContext {
    changeLayoutType: (type: ELayoutTypes) => void;
    layoutType: ELayoutTypes;
}

export interface IPanel {
    half?: boolean;
}

export interface IVSCodeInput extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    isError?: boolean;
}

export interface IEditIcon extends SVGProps<SVGSVGElement> {}
