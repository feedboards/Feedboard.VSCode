import { createContext, useContext, useEffect, useState } from 'react';
import { IGlobalContext, IContextProviderProps, isOAuthType, isConnectionString } from '..';
import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { ELoginType, EMainPanelCommands, TConnection } from '../../../../../src/helpers';
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

    const [connection, setConnection] = useState<TConnection>();

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        console.log('main window');

        vscode.postMessage({ command: EMainPanelCommands.getIsLoggedInAzure });
        vscode.postMessage({ command: EMainPanelCommands.getConnection });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    useEffect(() => {
        console.log('useEffect(connection)');

        if (connection !== undefined && isOAuthType(connection.settings)) {
            vscode.postMessage({
                command: EMainPanelCommands.getEventHubs,
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
            command: EMainPanelCommands;
            payload: any;
        }>
    ) => {
        const payload = event.data.payload;

        switch (event.data.command) {
            case EMainPanelCommands.setConnection:
                setConnection(payload);

                if (payload.settings.loginType == ELoginType.oAuth && isLoggedInAzure) {
                    vscode.postMessage({
                        command: EMainPanelCommands.getEventHubs,
                        payload: {
                            subscriptionId: payload.settings.subscription.subscriptionId,
                            resourceGroupName: payload.settings.resourceGroup.name,
                            namespaceName: payload.settings.namespace.name,
                        },
                    });
                }
                break;

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

            case EMainPanelCommands.setEventHubs:
                setEventHubs(payload);
                setEventHubLoading(false);
                break;

            case EMainPanelCommands.setConsumerGroups:
                setConsumerGroups(payload);
                setConsumerGroupLoading(false);
                break;

            case EMainPanelCommands.setIsLoggedInAzure:
                setIsLoggedInAzure(payload);

                if (payload == true) {
                    vscode.postMessage({ command: EMainPanelCommands.getConnection });
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
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
