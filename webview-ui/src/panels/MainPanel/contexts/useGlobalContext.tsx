import { createContext, useContext, useEffect, useState } from 'react';
import { IGlobalContext, IContextProviderProps } from '..';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { ConsumerGroup, EHNamespace, Eventhub } from '@azure/arm-eventhub';
import { EMainPanelCommands } from '../../../../../src/helpers';
import { vscode } from '../../../utilities';

const GlobalContext = createContext<IGlobalContext | undefined>(undefined);

export const useGlobal = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }

    return context;
};

export const GlobalProvider: React.FC<IContextProviderProps> = ({ children }) => {
    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>(undefined);

    const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>();
    const [resourceGroupLoading, setResourceGroupLoading] = useState<boolean>(false);
    const [selectedResourceGroup, setSelectedResourceGroup] = useState<ResourceGroup | undefined>(undefined);

    const [namespaces, setNamespaces] = useState<EHNamespace[]>();
    const [namespaceLoading, setNamespaceLoading] = useState<boolean>(false);
    const [selectedNamespace, setSelectedNamespace] = useState<EHNamespace | undefined>(undefined);

    const [eventHubs, setEventHubs] = useState<Eventhub[]>();
    const [eventHubLoading, setEventHubLoading] = useState<boolean>(false);
    const [selectedEventHub, setSelectedEventHub] = useState<Eventhub | undefined>(undefined);

    const [consumerGroups, setConsumerGroups] = useState<ConsumerGroup[]>();
    const [consumerGroupLoading, setConsumerGroupLoading] = useState<boolean>(false);

    const [messages, setMessages] = useState<any[] | undefined>(undefined);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessages] = useState<any | undefined>(undefined);

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        vscode.postMessage({ command: EMainPanelCommands.getIsLoggedInAzure });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    useEffect(() => {
        if (isLoggedInAzure) {
            console.log('isLoggedInAzure useEffect', isLoggedInAzure);

            vscode.postMessage({
                command: EMainPanelCommands.getSubscriptions,
            });
        }
    }, [isLoggedInAzure]);

    const _handleMessage = (
        event: MessageEvent<{
            command: EMainPanelCommands;
            payload: any;
        }>
    ) => {
        const payload = event.data.payload;

        switch (event.data.command) {
            case EMainPanelCommands.setMessages:
                console.log(payload);

                setMessages((prev) => {
                    const tmp = [];

                    if (prev !== undefined) {
                        tmp.push(...prev);
                    }

                    tmp.push(payload);

                    return tmp;
                });
                break;

            case EMainPanelCommands.setSubscriptions:
                setSubscriptions(payload);
                setSubscriptionLoading(false);
                break;

            case EMainPanelCommands.setResourceGroups:
                setResourceGroups(payload);
                setResourceGroupLoading(false);
                break;

            case EMainPanelCommands.setNamespaces:
                setNamespaces(payload);
                setNamespaceLoading(false);
                break;

            case EMainPanelCommands.setEventHubs:
                setEventHubs(payload);
                setEventHubLoading(false);
                break;

            case EMainPanelCommands.setConsumerGroups:
                setConsumerGroups(payload);
                setConsumerGroupLoading(false);
                break;

            case EMainPanelCommands.setIsLoggedInAzure:
                console.log(EMainPanelCommands.setIsLoggedInAzure, payload);

                setIsLoggedInAzure(payload);

                if (payload === true) {
                    vscode.postMessage({ command: EMainPanelCommands.getSubscriptions });
                    setSubscriptionLoading(true);
                }
                break;
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                setSubscriptions,
                setSubscriptionLoading,
                setSelectedSubscription,
                subscriptions,
                subscriptionLoading,
                selectedSubscription,
                setResourceGroups,
                setResourceGroupLoading,
                setSelectedResourceGroup,
                resourceGroups,
                resourceGroupLoading,
                selectedResourceGroup,
                setNamespaces,
                setNamespaceLoading,
                setSelectedNamespace,
                namespaces,
                namespaceLoading,
                selectedNamespace,
                setEventHubs,
                setEventHubLoading,
                setSelectedEventHub,
                eventHubs,
                eventHubLoading,
                selectedEventHub,
                setConsumerGroups,
                setConsumerGroupLoading,
                consumerGroups,
                consumerGroupLoading,
                setMessages,
                setMessageLoading,
                setSelectedMessages,
                messages,
                messageLoading,
                selectedMessage,
                setIsLoggedInAzure,
                isLoggedInAzure,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
