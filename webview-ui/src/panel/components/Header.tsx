import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { useGlobal, useLayout } from '../contexts';
import { VSCodeInput } from '../../components';
import { ChangeEvent, useState } from 'react';
import { addLoading, handleDropdownChange, vscode } from '../../utilities';
import { ConsumerGroup, Eventhub } from '@azure/arm-eventhub';
import { EPanelCommands } from '../../../../common/commands';
import {
    ELoginType,
    isTConnectionMQTT,
    isTConnectionSettingsAzureConnectionString,
    isTConnectionSettingsAzureOAuth,
} from '@feedboard/feedboard.core';
import classNames from 'classnames';
import { ELayoutTypes } from '../types';

export const Header = (): JSX.Element => {
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
        setTopic,
        topic,
    } = useGlobal();

    const onSendMessage = () => {};

    const onSingInWithAzure = () => {
        vscode.postMessage({
            command: EPanelCommands.singInWithAzure,
        });
    };

    const onConnect = () => {
        if (
            connection?.settings.loginType === ELoginType.azureOAuth &&
            isTConnectionSettingsAzureOAuth(connection.settings)
        ) {
            // TODO add here validation
            vscode.postMessage({
                command: EPanelCommands.startMonitoring,
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
            isTConnectionSettingsAzureConnectionString(connection.settings)
        ) {
            // TODO add here validation
            vscode.postMessage({
                command: EPanelCommands.startMonitoringByConnectionString,
                payload: {
                    eventHubName: eventHubNameConnectionString,
                    connectionString: connection?.settings.connectionString,
                    consumerGroupName: consumerGroupNameConnectionString,
                },
            });
        } else if (connection?.settings.loginType === ELoginType.mqtt && isTConnectionMQTT(connection.settings)) {
            vscode.postMessage({
                command: EPanelCommands.startMonitoring,
                payload: {
                    host: connection.settings.host,
                    topic,
                },
            });
        }
    };

    const onChangeEventHubConnectionString = (x: ChangeEvent<HTMLInputElement>) => {
        setEventHubNameConnectionString(x.target.value);
    };

    const onChangeConsumerGroupConnectionString = (x: ChangeEvent<HTMLInputElement>) => {
        setConsumerGroupNameConnectionString(x.target.value);
    };

    const onChangeTopic = (x: ChangeEvent<HTMLInputElement>) => {
        setTopic(x.target.value);
    };

    const render = (): JSX.Element => {
        switch (layoutType) {
            case ELayoutTypes.withAzureOAuth:
                return (
                    <>
                        {isTConnectionSettingsAzureOAuth(connection?.settings) &&
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
                                                        if (
                                                            x !== undefined &&
                                                            isTConnectionSettingsAzureOAuth(connection?.settings)
                                                        ) {
                                                            setSelectedEventHub(x);

                                                            vscode.postMessage({
                                                                command: EPanelCommands.getConsumerGroups,
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

                                    <VSCodeButton
                                        className="main-panel__header_button main-panel__header_button-first"
                                        appearance="secondary"
                                        onClick={onSingInWithAzure}>
                                        Sing in with Azure
                                    </VSCodeButton>
                                </>
                            )}

                        {isTConnectionSettingsAzureOAuth(connection?.settings) &&
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
                );

            case ELayoutTypes.withConnectionString:
                return (
                    <>
                        <VSCodeInput
                            onChange={onChangeEventHubConnectionString}
                            className="main-panel__header_input"
                            placeholder="Event Hub"
                        />
                        <VSCodeInput
                            onChange={onChangeConsumerGroupConnectionString}
                            className="main-panel__header_input"
                            placeholder="Consumer Group"
                        />
                    </>
                );

            case ELayoutTypes.withMQTT:
                return (
                    <VSCodeInput onChange={onChangeTopic} className="main-panel__header_input" placeholder="Topic" />
                );

            default:
                return <></>;
        }
    };

    return (
        <>
            <div className="main-panel__header">
                {render()}

                <VSCodeButton
                    className={classNames('main-panel__header_button', {
                        ['main-panel__header_button-first']:
                            layoutType === ELayoutTypes.withConnectionString || layoutType === ELayoutTypes.withMQTT,
                    })}
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
