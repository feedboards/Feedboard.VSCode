import { createContext, useContext, useEffect, useState } from 'react';
import { IGlobalContext, IContextProviderProps } from '..';
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

    const [connection, setConnection] = useState<TConnection>({
        id: 'asd',
        name: 'name',
        settings: {
            loginType: ELoginType.oAuth,
            subscriptionId: 'subscriptionId',
            resourceGroupName: 'resourceGroupName',
            namespaceName: 'namespaceName',
            eventHubName: 'eventHubName',
            consumerGroupName: 'consumerGroupName',
            connectionString: 'connectionString',
        },
    });

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        console.log('main window');

        vscode.postMessage({ command: EMainPanelCommands.getIsLoggedInAzure });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    useEffect(() => {
        if (isLoggedInAzure) {
            vscode.postMessage({
                command: EMainPanelCommands.getSubscriptions,
            });
        }
    }, [isLoggedInAzure]);

    useEffect(() => {
        vscode.postMessage({
            command: EMainPanelCommands.getConnection,
        });
    }, []);

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

                if (payload.settings.loginType == ELoginType.oAuth) {
                    vscode.postMessage({
                        command: EMainPanelCommands.getEventHubs,
                        payload: {
                            subscriptionId: payload.settings.subscriptionId,
                            resourceGroupName: payload.settings.resourceGroupName,
                            namespaceName: payload.settings.namespaceName,
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

                if (payload === true) {
                    vscode.postMessage({ command: EMainPanelCommands.getSubscriptions });
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
