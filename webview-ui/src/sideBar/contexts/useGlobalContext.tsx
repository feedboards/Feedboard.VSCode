import { createContext, FC, useContext, useEffect, useState } from 'react';
import { vscode } from '../../utilities';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { ESideBarCommands } from '../../../../common/commands';
import { TConnection } from '@feedboard/feedboard.core';
import { IContextProviderProps, IGlobalContext } from '../types';

const GlobalContext = createContext<IGlobalContext | undefined>(undefined);

export const useGlobal = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }

    return context;
};

export const GlobalProvider: FC<IContextProviderProps> = ({ children }) => {
    const [subscriptionLoading, setSubscriptionLoading] = useState<boolean>(false);
    const [resourceGroupLoading, setResourceGroupLoading] = useState<boolean>(false);
    const [namespaceLoading, setNamespaceLoading] = useState<boolean>(false);

    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | undefined>(undefined);
    const [selectedResourceGroup, setSelectedResourceGroup] = useState<ResourceGroup | undefined>(undefined);
    const [selectedNamespace, setSelectedNamespace] = useState<EHNamespace | undefined>(undefined);

    const [subscriptions, setSubscriptions] = useState<Subscription[]>();
    const [resourceGroups, setResourceGroups] = useState<ResourceGroup[]>();
    const [namespaces, setNamespaces] = useState<EHNamespace[]>();

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);
    const [savedConnections, setSavedConnections] = useState<TConnection[] | null>(null);

    const [baseAPIUrl, setBaseAPIUrlState] = useState<string | undefined>(undefined);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        vscode.postMessage({ command: ESideBarCommands.getIsLoggedInAzure });
        vscode.postMessage({ command: ESideBarCommands.getSavedConnections });
        vscode.postMessage({ command: ESideBarCommands.getBaseAPIUrl });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    const _handleMessage = (
        event: MessageEvent<{
            command: ESideBarCommands;
            payload: any;
        }>
    ) => {
        const payload = event.data.payload;

        switch (event.data.command) {
            case ESideBarCommands.setBaseAPIUrl:
                setBaseAPIUrlState(payload);

                console.log(payload);

                break;

            case ESideBarCommands.setSavedConnections:
                setSavedConnections(payload);
                break;

            case ESideBarCommands.setIsLoggedInAzure:
                console.log('payload from command setIsLoggedInAzure', payload);

                setIsLoggedInAzure(payload);

                if (payload === true) {
                    vscode.postMessage({ command: ESideBarCommands.getSubscriptions });

                    setSubscriptionLoading(true);
                }
                break;

            case ESideBarCommands.setSubscriptions:
                console.log('payload from command setSubscriptions', payload);

                setSubscriptions(payload);
                setSubscriptionLoading(false);
                break;

            case ESideBarCommands.setResourceGroups:
                console.log('payload from command setResourceGroups', payload);

                setResourceGroups(payload);
                setResourceGroupLoading(false);
                break;

            case ESideBarCommands.setNamespaces:
                console.log('payload from command setNamespaces', payload);

                setNamespaces(payload);
                setNamespaceLoading(false);
                break;
        }
    };

    const setBaseAPIUrl = (url: string) => {
        setBaseAPIUrlState(url);

        vscode.postMessage({
            command: ESideBarCommands.updateBaseAPIUrl,
            payload: url,
        });
    };

    const addConnection = (connection: TConnection) => {
        setSavedConnections((prev) => {
            if (prev !== null) {
                return [...prev, connection];
            }

            return [connection];
        });
    };

    const removeConnection = (connection: TConnection) => {
        setSavedConnections((prev) => {
            if (prev === null) {
                return null;
            }

            return prev.filter((x) => x.id !== connection.id);
        });

        vscode.postMessage({
            command: ESideBarCommands.removeConnection,
            payload: connection,
        });
    };

    return (
        <GlobalContext.Provider
            value={{
                removeConnection,
                addConnection,
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
                setIsLoggedInAzure,
                isLoggedInAzure,
                savedConnections,
                baseAPIUrl,
                setBaseAPIUrl,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
