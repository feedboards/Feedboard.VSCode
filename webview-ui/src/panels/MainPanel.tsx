import {
    VSCodeButton,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeDropdown,
    VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render, vscode } from '../utilities';
import { useEffect, useState } from 'react';
import { TTmp } from './types';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';

const MainPanel = () => {
    // Dropdown States
    const [subscriptions, setSubscriptions] = useState<TTmp[]>();
    const [selectedSubscription, setSelectedSubscription] = useState<TTmp | undefined>(undefined);

    const [resourceGroups, setResourceGroups] = useState<TTmp[]>();
    const [selectedResourceGroup, setSelectedResourceGroup] = useState<TTmp | undefined>(undefined);

    const [namespaces, setNamespaces] = useState<TTmp[]>();
    const [selectedNamespace, setSelectedNamespace] = useState<TTmp | undefined>(undefined);

    const [eventHubs, setEventHubs] = useState<TTmp[]>();
    const [selectedEventHub, setSelectedEventHub] = useState<TTmp | undefined>(undefined);

    const [consumerGroups, setConsumerGroups] = useState<TTmp[]>();
    const [selectedConsumerGroup, setSelectedConsumerGroup] = useState<TTmp | undefined>(undefined);

    const [messages, setMessages] = useState<any[] | undefined>(undefined);
    const [selectedMessage, setSelectedMessages] = useState<any | undefined>(undefined);

    // TODO Clean up this useEffect
    useEffect(() => {
        setSubscriptions([{ name: 'test-1' }, { name: 'test-2' }]);
        setResourceGroups([{ name: 'test-1' }, { name: 'test-2' }]);
        setNamespaces([{ name: 'test-1' }, { name: 'test-2' }]);
        setEventHubs([{ name: 'test-123' }, { name: 'test-423' }, { name: 'test-23423' }, { name: 'test-1255553' }]);
    }, []);

    useEffect(() => {
        const handleMessage = (
            event: MessageEvent<{
                command: string;
                payload: any;
            }>
        ) => {
            const payload = event.data.payload;

            switch (event.data.command) {
                case 'setMessages':
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

                case 'setSubscriptions':
                    setSubscriptions(payload);
                    break;

                case 'setResourceGroups':
                    setResourceGroups(payload);
                    break;

                case 'setNamespaces':
                    setNamespaces(payload);
                    break;

                case 'setEventHubs':
                    setEventHubs(payload);
                    break;

                case 'setConsumerGroups':
                    setConsumerGroups(payload);
                    break;
            }
        };

        window.addEventListener('message', handleMessage);

        vscode.postMessage({
            command: 'getSubscriptions',
        });

        return () => window.removeEventListener('message', handleMessage);
    }, []);

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

    const onClickSendMessage = () => {
        vscode.postMessage({
            command: 'startMonitoring',
            payload: {
                namespace: '',
                eventHubName: '',
                consumerGroup: '',
            },
        });
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
                            handleDropdownChange<TTmp>(
                                x,
                                (x: undefined | TTmp) => {
                                    setSelectedSubscription(x);
                                    setSelectedResourceGroup(undefined);
                                    setSelectedNamespace(undefined);
                                    setSelectedEventHub(undefined);
                                    setSelectedMessages(undefined);
                                },
                                subscriptions
                            )
                        }>
                        <VSCodeOption value="">Select a subscription</VSCodeOption>
                        {subscriptions?.map((x: TTmp, index: number) => (
                            <VSCodeOption key={index} value={x.name}>
                                {x.name}
                            </VSCodeOption>
                        ))}
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
                                handleDropdownChange<TTmp>(
                                    x,
                                    (x: undefined | TTmp) => {
                                        setSelectedResourceGroup(x);
                                        setSelectedNamespace(undefined);
                                        setSelectedEventHub(undefined);
                                        setSelectedMessages(undefined);
                                    },
                                    resourceGroups
                                )
                            }>
                            <VSCodeOption value="">Select a resource group</VSCodeOption>
                            {resourceGroups?.map((x: TTmp, index: number) => (
                                <VSCodeOption key={index} value={x.name}>
                                    {x.name}
                                </VSCodeOption>
                            ))}
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
                                handleDropdownChange<TTmp>(
                                    x,
                                    (x: undefined | TTmp) => {
                                        setSelectedNamespace(x);
                                        setSelectedEventHub(undefined);
                                        setSelectedMessages(undefined);
                                    },
                                    namespaces
                                )
                            }>
                            <VSCodeOption value="">Select a namespace</VSCodeOption>
                            {eventHubs?.map((x: TTmp, index: number) => (
                                <VSCodeOption key={index} value={x.name}>
                                    {x.name}
                                </VSCodeOption>
                            ))}
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
                                    namespaces &&
                                    handleDropdownChange<TTmp>(
                                        x,
                                        (x: undefined | TTmp) => setSelectedConsumerGroup(x),
                                        namespaces
                                    )
                                }>
                                <VSCodeOption value="">Select a consumer group</VSCodeOption>
                                {eventHubs?.map((x: TTmp, index: number) => (
                                    <VSCodeOption key={index} value={x.name}>
                                        {x.name}
                                    </VSCodeOption>
                                ))}
                            </VSCodeDropdown>
                        </div>
                    )}
                <VSCodeButton className="main-panel__header_button" onClick={onClickSendMessage}>
                    Send Message
                </VSCodeButton>
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

                                {eventHubs?.map((x: TTmp, index: number) => (
                                    <VSCodeDataGridRow key={index} onClick={() => setSelectedEventHub(x)}>
                                        <VSCodeDataGridCell gridColumn="1">{x.name}</VSCodeDataGridCell>
                                    </VSCodeDataGridRow>
                                ))}
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
