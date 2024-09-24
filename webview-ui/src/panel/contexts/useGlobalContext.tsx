import { createContext, FC, useContext, useEffect, useState } from 'react';
import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { EPanelCommands } from '../../../../common/commands';
import { vscode } from '../../utilities';
import { ELoginType, isTConnectionSettingsAzureOAuth, TConnection } from '@feedboard/feedboard.core';
import { IContextProviderProps, IGlobalContext } from '../types';

const GlobalContext = createContext<IGlobalContext | undefined>(undefined);

export const useGlobal = (): IGlobalContext => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }

    return context;
};

export const GlobalProvider: FC<IContextProviderProps> = ({ children }) => {
    const [eventHubLoading, setEventHubLoading] = useState<boolean>(false);
    const [consumerGroupLoading, setConsumerGroupLoading] = useState<boolean>(false);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);

    const [selectedEventHub, setSelectedEventHub] = useState<Eventhub | undefined>(undefined);
    const [selectedConsumerGroups, setSelectedConsumerGroups] = useState<ConsumerGroup | undefined>(undefined);
    const [selectedMessage, setSelectedMessages] = useState<any | undefined>(undefined);

    const [eventHubs, setEventHubs] = useState<Eventhub[]>();
    const [consumerGroups, setConsumerGroups] = useState<ConsumerGroup[]>();
    const [messages, setMessages] = useState<any[] | undefined>(undefined);

    const [eventHubNameConnectionString, setEventHubNameConnectionString] = useState<string>();
    const [consumerGroupNameConnectionString, setConsumerGroupNameConnectionString] = useState<string>();

    const [topic, setTopic] = useState<string | undefined>();

    const [connection, setConnection] = useState<TConnection>();

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        vscode.postMessage({ command: EPanelCommands.getIsLoggedInAzure });
        vscode.postMessage({ command: EPanelCommands.getConnection });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    useEffect(() => {
        console.log('useEffect(connection)');

        if (connection !== undefined && isTConnectionSettingsAzureOAuth(connection.settings)) {
            vscode.postMessage({
                command: EPanelCommands.getEventHubs,
                payload: {
                    subscriptionId: connection.settings.subscription.subscriptionId,
                    resourceGroupName: connection.settings.resourceGroup.name,
                    namespaceName: connection.settings.namespace.name,
                },
            });
        }
    }, [connection]);

    const _handleMessage = (
        event: MessageEvent<{
            command: EPanelCommands;
            payload: any;
        }>
    ) => {
        const payload = event.data.payload;

        switch (event.data.command) {
            case EPanelCommands.setConnection:
                setConnection(payload);

                if (payload.settings.loginType == ELoginType.azureOAuth && isLoggedInAzure) {
                    vscode.postMessage({
                        command: EPanelCommands.getEventHubs,
                        payload: {
                            subscriptionId: payload.settings.subscription.subscriptionId,
                            resourceGroupName: payload.settings.resourceGroup.name,
                            namespaceName: payload.settings.namespace.name,
                        },
                    });
                }
                break;

            case EPanelCommands.setMessages:
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

            case EPanelCommands.setEventHubs:
                console.log('payload of useGlobalContext', payload);

                setEventHubs(payload);
                setEventHubLoading(false);
                break;

            case EPanelCommands.setConsumerGroups:
                setConsumerGroups(payload);
                setConsumerGroupLoading(false);
                break;

            case EPanelCommands.setIsLoggedInAzure:
                setIsLoggedInAzure(payload);

                if (payload == true) {
                    vscode.postMessage({ command: EPanelCommands.getConnection });
                }
                break;
        }
    };

    return (
        <GlobalContext.Provider
            value={{
                eventHubNameConnectionString,
                setEventHubNameConnectionString,
                consumerGroupNameConnectionString,
                setConsumerGroupNameConnectionString,
                selectedConsumerGroups,
                setSelectedConsumerGroups,
                connection,
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
                topic,
                setTopic,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
