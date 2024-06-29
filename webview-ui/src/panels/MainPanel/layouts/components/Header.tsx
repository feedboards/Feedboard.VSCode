import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { useGlobal, useLayout } from '../../contexts';
import { ELayoutTypes } from '../../enums';
import { VSCodeInput } from '../../../../components';
import { ChangeEvent, useEffect, useState } from 'react';
import { addLoading, handleDropdownChange, vscode } from '../../../../utilities';
import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { ELoginType, EMainPanelCommands } from '../../../../../../src/helpers';
import { isConnectionString, isOAuthType } from '../..';

export const Header = () => {
    const [consumerGroupName, setConsumerGroupName] = useState<string>();

    const { layoutType } = useLayout();
    const {
        connection,
        setConsumerGroupNameConnectionString,
        consumerGroupNameConnectionString,
        setEventHubNameConnectionString,
        setSelectedEventHub,
        eventHubNameConnectionString,
        eventHubs,
        eventHubLoading,
        selectedEventHub,
        consumerGroups,
        setConsumerGroupLoading,
        consumerGroupLoading,
    } = useGlobal();

    const onSendMessage = () => {};

    const onSingInWithAzure = () => {
        vscode.postMessage({
            command: EMainPanelCommands.singInWithAzure,
        });
    };

    const onConnect = () => {
        if (connection?.settings.loginType === ELoginType.oAuth && isOAuthType(connection.settings)) {
            vscode.postMessage({
                command: EMainPanelCommands.startMonitoring,
                payload: {
                    eventHubName: selectedEventHub?.name,
                    consumerGroupName: consumerGroupName,
                    resourceGroupName: connection?.settings.resourceGroup.name,
                    namespaceName: connection.settings.namespace.name,
                    subscriptionId: connection.settings.subscription.subscriptionId,
                },
            });
        } else if (
            connection?.settings.loginType === ELoginType.connectionString &&
            isConnectionString(connection.settings)
        ) {
            vscode.postMessage({
                command: EMainPanelCommands.startMonitoringByConnectionString,
                payload: {
                    eventHubName: eventHubNameConnectionString,
                    connectionString: connection?.settings.connectionString,
                    consumerGroupName: consumerGroupNameConnectionString,
                },
            });
        }
    };

    const onChandeEventHubConnectionString = (x: ChangeEvent<HTMLInputElement>) => {
        setEventHubNameConnectionString(x.target.value);
    };

    const onChandeConsumerGroupConnectionString = (x: ChangeEvent<HTMLInputElement>) => {
        setConsumerGroupNameConnectionString(x.target.value);
    };

    useEffect(() => {
        console.log(layoutType);
    }, [layoutType]);

    return (
        <>
            <div className="main-panel__header">
                {layoutType === ELayoutTypes.withConnectionString && (
                    <>
                        <VSCodeInput
                            onChange={onChandeEventHubConnectionString}
                            className="main-panel__header_input"
                            placeholder="Event Hub"
                        />
                        <VSCodeInput
                            onChange={onChandeConsumerGroupConnectionString}
                            className="main-panel__header_input"
                            placeholder="Consumer Group"
                        />
                    </>
                )}

                {layoutType === ELayoutTypes.withAzureOAuth && (
                    <>
                        {isOAuthType(connection?.settings) &&
                            connection?.settings.subscription.subscriptionId !== undefined &&
                            connection?.settings.resourceGroup.name !== undefined &&
                            connection?.settings.namespace.name !== undefined && (
                                <>
                                    <div className="main-panel__header_container">
                                        <label htmlFor="eventHubs">Event Hubs</label>
                                        <VSCodeDropdown
                                            id="eventHubs"
                                            onChange={(x) =>
                                                eventHubs &&
                                                handleDropdownChange<Eventhub>(
                                                    x,
                                                    (x: undefined | Eventhub) => {
                                                        if (x !== undefined && isOAuthType(connection?.settings)) {
                                                            setSelectedEventHub(x);

                                                            vscode.postMessage({
                                                                command: EMainPanelCommands.getConsumerGroups,
                                                                payload: {
                                                                    subscriptionId:
                                                                        connection?.settings.subscription
                                                                            .subscriptionId,
                                                                    resourceGroupName:
                                                                        connection?.settings.resourceGroup.name,
                                                                    namespaceName: connection?.settings.namespace.name,
                                                                    eventHubName: x.name,
                                                                },
                                                            });
                                                        }

                                                        setConsumerGroupLoading(true);
                                                    },
                                                    eventHubs
                                                )
                                            }>
                                            {addLoading(
                                                eventHubLoading,
                                                <>
                                                    <VSCodeOption value="">Select a event hub</VSCodeOption>
                                                    {eventHubs?.map((x: ConsumerGroup, index: number) => (
                                                        <VSCodeOption key={index} value={x.name}>
                                                            {x.name}
                                                        </VSCodeOption>
                                                    ))}
                                                </>
                                            )}
                                        </VSCodeDropdown>
                                    </div>

                                    {/* <VSCodeButton
                                        className="main-panel__header_button main-panel__header_button-first"
                                        appearance="secondary"
                                        onClick={onConnect}>
                                        Connect
                                    </VSCodeButton>

                                    <VSCodeButton className="main-panel__header_button" onClick={onSendMessage}>
                                        Send Message
                                    </VSCodeButton> */}
                                </>
                            )}

                        {isOAuthType(connection?.settings) &&
                            connection?.settings.subscription.subscriptionId !== undefined &&
                            connection?.settings.resourceGroup.name !== undefined &&
                            connection?.settings.namespace.name !== undefined &&
                            selectedEventHub !== undefined && (
                                <>
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
                                                            setConsumerGroupName(x.name);
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
                                </>
                            )}
                    </>
                )}

                {/* {layoutType === ELayoutTypes.withAzureOAuth && (
                    <VSCodeButton
                        className="main-panel__header_button main-panel__header_button-first"
                        appearance="secondary"
                        onClick={onSingInWithAzure}>
                        Sing in with Azure
                    </VSCodeButton>
                )} */}

                <VSCodeButton
                    className="main-panel__header_button main-panel__header_button-first"
                    appearance="secondary"
                    onClick={onConnect}>
                    Connect
                </VSCodeButton>

                <VSCodeButton className="main-panel__header_button" onClick={onSendMessage}>
                    Send Message
                </VSCodeButton>
            </div>
        </>
    );
};
