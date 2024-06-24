import { Subscription } from '@azure/arm-subscriptions';
import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { EMainPanelCommands } from '../../../../../../src/helpers';
import { vscode } from '../../../../utilities';
import { ResourceGroup } from '@azure/arm-resources';
import { ConsumerGroup, EHNamespace } from '@azure/arm-eventhub';
import { addLoading, useGlobal } from '../..';
import { ChangeLayoutButtons } from '.';

export const HeaderWithAzureOAuth = () => {
    const {
        setSelectedSubscription,
        setResourceGroupLoading,
        setSelectedResourceGroup,
        setNamespaceLoading,
        setSelectedNamespace,
        setEventHubLoading,
        setSelectedEventHub,
        setSelectedMessages,
        subscriptions,
        subscriptionLoading,
        selectedSubscription,
        resourceGroups,
        resourceGroupLoading,
        selectedResourceGroup,
        namespaces,
        namespaceLoading,
        selectedNamespace,
        selectedEventHub,
        consumerGroups,
        consumerGroupLoading,
        isLoggedInAzure,
    } = useGlobal();

    function handleDropdownChange<TState>(event: any, setState: Function, state: TState[]) {
        const index: number = event.target.selectedIndex - 1;
        const element: undefined | null | TState = index >= 0 ? state[index] : null;

        if (element === undefined) {
            return;
        }

        if (element === null) {
            setState(undefined);
            return;
        }

        setState(element);
    }

    const onClickSendMessage = () => {};

    return (
        <div className="main-panel__header">
            <div className="main-panel__header_container">
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
                                setSelectedEventHub(undefined);
                                setSelectedMessages(undefined);

                                if (x !== undefined) {
                                    vscode.postMessage({
                                        command: EMainPanelCommands.getResourceGroups,
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
                <div className="main-panel__header_container">
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
                                    setSelectedEventHub(undefined);
                                    setSelectedMessages(undefined);

                                    console.log('handleDropdownChange<ResourceGroup> - x', x);

                                    if (x !== undefined) {
                                        vscode.postMessage({
                                            command: EMainPanelCommands.getNamespaces,
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
                <div className="main-panel__header_container">
                    <label htmlFor="namespaces">Namespaces</label>
                    <VSCodeDropdown
                        id="namespaces"
                        onChange={(x) =>
                            namespaces &&
                            handleDropdownChange<EHNamespace>(
                                x,
                                (x: undefined | EHNamespace) => {
                                    setSelectedNamespace(x);
                                    setSelectedEventHub(undefined);
                                    setSelectedMessages(undefined);

                                    if (x !== undefined) {
                                        vscode.postMessage({
                                            command: EMainPanelCommands.getEventHubs,
                                            payload: {
                                                subscriptionId: selectedSubscription.subscriptionId,
                                                resourceGroupName: selectedResourceGroup.name,
                                                namespaceName: x.name,
                                            },
                                        });

                                        setEventHubLoading(true);
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

            {selectedSubscription !== undefined &&
                selectedResourceGroup !== undefined &&
                selectedNamespace !== undefined &&
                selectedEventHub !== undefined && (
                    <div className="main-panel__header_container">
                        <label htmlFor="consumerGroup">Consumer Groups</label>
                        <VSCodeDropdown
                            id="consumerGroup"
                            onChange={(x) =>
                                consumerGroups &&
                                handleDropdownChange<ConsumerGroup>(
                                    x,
                                    (x: undefined | ConsumerGroup) => {
                                        if (x !== undefined) {
                                            vscode.postMessage({
                                                command: EMainPanelCommands.startMonitoring,
                                                payload: {
                                                    eventHubName: selectedEventHub.name,
                                                    consumerGroupName: x.name,
                                                    resourceGroupName: selectedResourceGroup.name,
                                                    namespaceName: selectedNamespace.name,
                                                    subscriptionId: selectedSubscription.subscriptionId,
                                                },
                                            });
                                        }
                                    },
                                    consumerGroups
                                )
                            }>
                            {addLoading(
                                consumerGroupLoading,
                                <>
                                    <VSCodeOption value="">Select a consumer group</VSCodeOption>
                                    {consumerGroups?.map((x: ConsumerGroup, index: number) => (
                                        <VSCodeOption key={index} value={x.name}>
                                            {x.name}
                                        </VSCodeOption>
                                    ))}
                                </>
                            )}
                        </VSCodeDropdown>
                    </div>
                )}

            {isLoggedInAzure ? (
                <VSCodeButton className="main-panel__header_button" onClick={onClickSendMessage}>
                    Send Message
                </VSCodeButton>
            ) : (
                <VSCodeButton
                    className="main-panel__header_button"
                    onClick={() =>
                        vscode.postMessage({
                            command: EMainPanelCommands.singInWithAzure,
                        })
                    }>
                    Sign In With Azure
                </VSCodeButton>
            )}

            <ChangeLayoutButtons />
        </div>
    );
};
