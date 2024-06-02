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
    const [selectedNamespaces, setSelectedNamespaces] = useState<TTmp | undefined>(undefined);

    const [eventHubs, setEventHubs] = useState<TTmp[]>();

    const [messages, setMessages] = useState<any[] | undefined>(undefined);
    const [selectedMessages, setSelectedMessages] = useState<any | undefined>(undefined);

    // TODO Clean up this useEffect
    useEffect(() => {
        setSubscriptions([{ name: 'test-1' }, { name: 'test-2' }]);
        setResourceGroups([{ name: 'test-1' }, { name: 'test-2' }]);
        setNamespaces([{ name: 'test-1' }, { name: 'test-2' }]);
        setEventHubs([{ name: 'test-123' }, { name: 'test-423' }, { name: 'test-23423' }, { name: 'test-1255553' }]);
    }, []);

    useEffect(() => {
        if (subscriptions !== undefined && resourceGroups !== undefined && eventHubs !== undefined) {
            setSelectedSubscription(subscriptions.at(0));
            setSelectedResourceGroup(resourceGroups.at(0));
            setSelectedNamespaces(eventHubs.at(0));
        }
    }, [subscriptions, resourceGroups, eventHubs]);

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
                            tmp.push([...prev]);
                        }

                        return [...tmp, payload];
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
            }
        };

        window.addEventListener('message', handleMessage);

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    function handleDropdownChange<TState>(event: any, setState: Function, state: TState[]) {
        const element: TState | undefined = state[event.target.selectedIndex];

        if (element === undefined) {
            return;
        }

        console.log(typeof state, element);

        setState(element);
    }

    const handleMessageActive = (message: any) => {
        setSelectedMessages(message);
    };

    const onClickSendMessage = () => {
        vscode.postMessage({
            command: 'startMonitoring',
            payload: '',
        });
    };

    return (
        <main className="main-panel">
            <div className="main-panel__header">
                <div className="main-panel__header_container">
                    <label htmlFor="subscriptions">Subscriptions</label>
                    <VSCodeDropdown
                        id="subscriptions"
                        value={selectedSubscription?.name}
                        onChange={(x) =>
                            subscriptions && handleDropdownChange<TTmp>(x, setSelectedSubscription, subscriptions)
                        }>
                        {subscriptions?.map((x: TTmp, index: number) => (
                            <VSCodeOption key={index}>{x.name}</VSCodeOption>
                        ))}
                    </VSCodeDropdown>
                </div>
                <div className="main-panel__header_container">
                    <label htmlFor="resourceGroups">Resource Groups</label>
                    <VSCodeDropdown
                        value={selectedResourceGroup?.name}
                        id="resourceGroups"
                        onChange={(x) =>
                            resourceGroups && handleDropdownChange<TTmp>(x, setSelectedResourceGroup, resourceGroups)
                        }>
                        {resourceGroups?.map((x: TTmp, index: number) => (
                            <VSCodeOption key={index}>{x.name}</VSCodeOption>
                        ))}
                    </VSCodeDropdown>
                </div>
                <div className="main-panel__header_container">
                    <label htmlFor="namespaces">Namespaces</label>
                    <VSCodeDropdown
                        id="namespaces"
                        value={selectedNamespaces?.name}
                        onChange={(x) =>
                            namespaces && handleDropdownChange<TTmp>(x, setSelectedNamespaces, namespaces)
                        }>
                        {eventHubs?.map((x: TTmp, index: number) => (
                            <VSCodeOption key={index}>{x.name}</VSCodeOption>
                        ))}
                    </VSCodeDropdown>
                </div>
                <VSCodeButton className="main-panel__header_button" onClick={onClickSendMessage}>
                    Send Message
                </VSCodeButton>
            </div>
            <div className="main-panel__wrapper">
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid>
                        <VSCodeDataGridRow rowType="header">
                            <VSCodeDataGridCell gridColumn="1">
                                <b>Event Hubs</b>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {eventHubs?.map((x: TTmp, index: number) => (
                            <VSCodeDataGridRow key={index}>
                                <VSCodeDataGridCell gridColumn="1">{x.name}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
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
                            <VSCodeDataGridRow key={index} onClick={() => handleMessageActive(x)}>
                                <VSCodeDataGridCell gridColumn="1">{index}</VSCodeDataGridCell>
                                <VSCodeDataGridCell gridColumn="2">{JSON.stringify(x)}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
                </div>
                <div className="main-panel__wrapper-colunm">
                    <JsonView
                        value={
                            selectedMessages !== undefined
                                ? selectedMessages
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
