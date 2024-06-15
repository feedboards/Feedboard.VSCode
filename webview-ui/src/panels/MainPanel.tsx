import {
    VSCodeButton,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeDropdown,
    VSCodeOption,
    VSCodeProgressRing,
} from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render, vscode } from '../utilities';
import { ReactElement, useEffect, useState } from 'react';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { ConsumerGroup, EHNamespace, Eventhub } from '@azure/arm-eventhub';
import { EMainPanelCommands } from '../../../src/helpers';

const MainPanel = () => {
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
    const [selectedEventHub, setSelectedEventHub] = useState<ConsumerGroup | undefined>(undefined);

    const [consumerGroups, setConsumerGroups] = useState<Eventhub[]>();
    const [consumerGroupLoading, setConsumerGroupLoading] = useState<boolean>(false);
    const [selectedConsumerGroup, setSelectedConsumerGroup] = useState<ConsumerGroup | undefined>(undefined);

    const [messages, setMessages] = useState<any[] | undefined>(undefined);
    const [messageLoading, setMessageLoading] = useState<boolean>(false);
    const [selectedMessage, setSelectedMessages] = useState<any | undefined>(undefined);

    const [isLoggedInAzure, setIsLoggedInAzure] = useState<boolean>(false);

    useEffect(() => {
        const handleMessage = (
            event: MessageEvent<{
                command: EMainPanelCommands;
                payload: any;
            }>
        ) => {
            console.log(event);

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

        window.addEventListener('message', handleMessage);

        vscode.postMessage({ command: EMainPanelCommands.getIsLoggedInAzure });

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    useEffect(() => {
        if (isLoggedInAzure) {
            console.log('isLoggedInAzure useEffect', isLoggedInAzure);

            vscode.postMessage({
                command: EMainPanelCommands.getSubscriptions,
            });
        }
    }, [isLoggedInAzure]);

    useEffect(() => {
        console.log(subscriptions);
    }, [subscriptions]);

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

    const addLoading = (state: boolean, Options: ReactElement) => {
        return (
            <>
                {state && (
                    <div className="main-panel__loading">
                        <div>Loading...</div>
                        <VSCodeProgressRing />
                    </div>
                )}
                {!state && Options}
            </>
        );
    };

    return (
        <main className="main-panel">
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
                                            setSelectedConsumerGroup(x);

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
            </div>
            <div className="main-panel__wrapper">
                <div className="main-panel__wrapper-colunm">
                    {selectedSubscription !== undefined &&
                        selectedResourceGroup !== undefined &&
                        selectedNamespace !== undefined && (
                            <VSCodeDataGrid>
                                <VSCodeDataGridRow rowType="header">
                                    <VSCodeDataGridCell gridColumn="1">
                                        <b>Event Hubs</b>
                                    </VSCodeDataGridCell>
                                </VSCodeDataGridRow>

                                {addLoading(
                                    eventHubLoading,
                                    <>
                                        {eventHubs?.map((x: Eventhub, index: number) => (
                                            <VSCodeDataGridRow
                                                key={index}
                                                onClick={() => {
                                                    setSelectedEventHub(x);

                                                    if (x !== undefined) {
                                                        vscode.postMessage({
                                                            command: EMainPanelCommands.getConsumerGroups,
                                                            payload: {
                                                                subscriptionId: selectedSubscription.subscriptionId,
                                                                resourceGroupName: selectedResourceGroup.name,
                                                                namespaceName: selectedNamespace.name,
                                                                eventHubName: x.name,
                                                            },
                                                        });

                                                        setConsumerGroupLoading(true);
                                                    }
                                                }}>
                                                <VSCodeDataGridCell gridColumn="1">{x.name}</VSCodeDataGridCell>
                                            </VSCodeDataGridRow>
                                        ))}
                                    </>
                                )}
                            </VSCodeDataGrid>
                        )}
                </div>
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid gridTemplateColumns="10% 90%">
                        <VSCodeDataGridRow rowType="header">
                            <VSCodeDataGridCell gridColumn="1">
                                <b>Index</b>
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn="2">
                                <b>Message</b>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {messages?.map((x: any, index: number) => (
                            <VSCodeDataGridRow key={index} onClick={() => setSelectedMessages(x)}>
                                <VSCodeDataGridCell gridColumn="1">{index}</VSCodeDataGridCell>
                                <VSCodeDataGridCell gridColumn="2">{JSON.stringify(x)}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
                </div>
                <div className="main-panel__wrapper-colunm">
                    <JsonView
                        value={
                            selectedMessage !== undefined
                                ? selectedMessage
                                : {
                                      str: 'str',
                                  }
                        }
                        style={vscodeTheme}
                    />
                </div>
            </div>
        </main>
    );
};

render(<MainPanel />);
