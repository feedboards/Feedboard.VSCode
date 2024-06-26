import { createContext, useContext, useEffect, useState } from 'react';
import { IGlobalContext, IContextProviderProps } from '..';
import { EMainSideBarCommands, TConnection } from '../../../../../src/helpers';
import { vscode } from '../../../utilities';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';

const GlobalContext = createContext<IGlobalContext | undefined>(undefined);

export const useGlobal = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }

    return context;
};

export const GlobalProvider: React.FC<IContextProviderProps> = ({ children }) => {
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

    const [connectionString, setConnectionString] = useState<string | undefined>(undefined);

    useEffect(() => {
        window.addEventListener('message', _handleMessage);

        vscode.postMessage({ command: EMainSideBarCommands.setIsLoggedInAzure });
        vscode.postMessage({ command: EMainSideBarCommands.getSavedConnections });

        return () => window.removeEventListener('message', _handleMessage);
    }, []);

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
                setIsLoggedInAzure(payload);

                if (payload === true) {
                    vscode.postMessage({ command: EMainSideBarCommands.getSubscriptions });
                    setSubscriptionLoading(true);
                }
                break;

            case EMainSideBarCommands.setSubscriptions:
                setSubscriptions(payload);
                setSubscriptionLoading(false);
                break;

            case EMainSideBarCommands.setResourceGroups:
                setResourceGroups(payload);
                setResourceGroupLoading(false);
                break;

            case EMainSideBarCommands.setNamespaces:
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

    return (
        <GlobalContext.Provider
            value={{
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
                setConnectionString,
                connectionString,
            }}>
            {children}
        </GlobalContext.Provider>
    );
};
