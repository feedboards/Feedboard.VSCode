import { createContext, FC, useContext, useEffect, useState } from 'react';
import { IGlobalContext, IContextProviderProps } from '..';
import { vscode } from '../../../utilities';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { EMainSideBarCommands } from '../../../../../common/commands';
import { TConnection } from '@feedboard/feedboard.core';

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

    // const [connectionString, setConnectionString] = useState<string | undefined>(undefined);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        vscode.postMessage({ command: EMainSideBarCommands.setIsLoggedInAzure });
        vscode.postMessage({ command: EMainSideBarCommands.getSavedConnections });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

    // useEffect(() => {
    //     if (subscriptions !== null && resourceGroups !== null && namespaces !== null) {

    //     }
    // }, [subscriptions, resourceGroups, namespaces]);

    const _handleMessage = (
        event: MessageEvent<{
            command: EMainSideBarCommands;
            payload: any;
        }>
    ) => {
        const payload = event.data.payload;

        switch (event.data.command) {
            case EMainSideBarCommands.setSavedConnections:
                setSavedConnections(payload);
                break;

            case EMainSideBarCommands.setIsLoggedInAzure:
                console.log('payload from command setIsLoggedInAzure', payload);

                setIsLoggedInAzure(payload);

                if (payload === true) {
                    vscode.postMessage({ command: EMainSideBarCommands.getSubscriptions });

                    setSubscriptionLoading(true);
                }
                break;

            case EMainSideBarCommands.setSubscriptions:
                console.log('payload from command setSubscriptions', payload);

                setSubscriptions(payload);
                setSubscriptionLoading(false);
                break;

            case EMainSideBarCommands.setResourceGroups:
                console.log('payload from command setResourceGroups', payload);

                setResourceGroups(payload);
                setResourceGroupLoading(false);
                break;

            case EMainSideBarCommands.setNamespaces:
                console.log('payload from command setNamespaces', payload);

                setNamespaces(payload);
                setNamespaceLoading(false);
                break;
        }
    };

    const addConnection = (connection: TConnection) => {
        setSavedConnections((prev) => {
            if (prev !== null) {
                return [...prev, connection];
            } else {
                return [connection];
            }
        });
    };

    const removeConnection = (connection: TConnection) => {
        setSavedConnections((prev) => {
            if (prev == undefined) {
                return prev;
            }

            return prev?.slice(prev?.indexOf(connection), 1);
        });

        vscode.postMessage({
            command: EMainSideBarCommands.removeConnection,
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
                // setConnectionString,
                // connectionString,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
