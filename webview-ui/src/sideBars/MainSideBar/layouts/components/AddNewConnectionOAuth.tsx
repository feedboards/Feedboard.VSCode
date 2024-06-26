import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { addLoading, handleDropdownChange, vscode } from '../../../../utilities';
import { Subscription } from '@azure/arm-subscriptions';
import { useGlobal } from '../../contexts';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { EMainSideBarCommands } from '../../../../../../src/helpers';

export const AddNewConnectionOAuth = () => {
    const {
        setSelectedSubscription,
        setResourceGroupLoading,
        setSelectedResourceGroup,
        setNamespaceLoading,
        setSelectedNamespace,
        subscriptions,
        subscriptionLoading,
        selectedSubscription,
        resourceGroups,
        resourceGroupLoading,
        selectedResourceGroup,
        namespaces,
        namespaceLoading,
    } = useGlobal();

    return (
        <>
            <div className="main-side-bar__wrapper_add-new-connection_container">
                <label htmlFor="subscriptions">Subscriptions</label>
                <VSCodeDropdown
                    id="subscriptions"
                    onChange={(x) =>
                        subscriptions &&
                        handleDropdownChange<Subscription>(
                            x,
                            (x: undefined | Subscription) => {
                                setSelectedSubscription(x);
                                setSelectedResourceGroup(undefined);
                                setSelectedNamespace(undefined);

                                if (x !== undefined) {
                                    vscode.postMessage({
                                        command: EMainSideBarCommands.getResourceGroups,
                                        payload: {
                                            subscriptionId: x.subscriptionId,
                                        },
                                    });

                                    setResourceGroupLoading(true);
                                }
                            },
                            subscriptions
                        )
                    }>
                    {addLoading(
                        subscriptionLoading,
                        <>
                            <VSCodeOption value="">Select a subscription</VSCodeOption>
                            {subscriptions?.map((x: Subscription, index: number) => (
                                <VSCodeOption key={index} value={x.subscriptionId}>
                                    {x.displayName}
                                </VSCodeOption>
                            ))}
                        </>
                    )}
                </VSCodeDropdown>
            </div>
            {selectedSubscription !== undefined && (
                <div className="main-side-bar__wrapper_add-new-connection_container">
                    <label htmlFor="resourceGroups">Resource Groups</label>
                    <VSCodeDropdown
                        id="resourceGroups"
                        value={selectedResourceGroup?.name}
                        onChange={(x) =>
                            resourceGroups &&
                            handleDropdownChange<ResourceGroup>(
                                x,
                                (x: undefined | ResourceGroup) => {
                                    setSelectedResourceGroup(x);
                                    setSelectedNamespace(undefined);

                                    if (x !== undefined) {
                                        vscode.postMessage({
                                            command: EMainSideBarCommands.getNamespaces,
                                            payload: {
                                                subscriptionId: selectedSubscription.subscriptionId,
                                                resourceGroupName: x.name,
                                            },
                                        });

                                        setNamespaceLoading(true);
                                    }
                                },
                                resourceGroups
                            )
                        }>
                        {addLoading(
                            resourceGroupLoading,
                            <>
                                <VSCodeOption value="">Select a resource group</VSCodeOption>
                                {resourceGroups?.map((x: ResourceGroup, index: number) => (
                                    <VSCodeOption key={index} value={x.name}>
                                        {x.name}
                                    </VSCodeOption>
                                ))}
                            </>
                        )}
                    </VSCodeDropdown>
                </div>
            )}
            {selectedSubscription !== undefined && selectedResourceGroup !== undefined && (
                <div className="main-side-bar__wrapper_add-new-connection_container">
                    <label htmlFor="namespaces">Namespaces</label>
                    <VSCodeDropdown
                        id="namespaces"
                        onChange={(x) =>
                            namespaces &&
                            handleDropdownChange<EHNamespace>(
                                x,
                                (x: undefined | EHNamespace) => {
                                    setSelectedNamespace(x);

                                    if (x !== undefined) {
                                        vscode.postMessage({
                                            command: EMainSideBarCommands.getEventHubs,
                                            payload: {
                                                subscriptionId: selectedSubscription.subscriptionId,
                                                resourceGroupName: selectedResourceGroup.name,
                                                namespaceName: x.name,
                                            },
                                        });
                                    }
                                },
                                namespaces
                            )
                        }>
                        {addLoading(
                            namespaceLoading,
                            <>
                                <VSCodeOption value="">Select a namespace</VSCodeOption>
                                {namespaces?.map((x: EHNamespace, index: number) => (
                                    <VSCodeOption key={index} value={x.name}>
                                        {x.name}
                                    </VSCodeOption>
                                ))}
                            </>
                        )}
                    </VSCodeDropdown>
                </div>
            )}
        </>
    );
};
