import {
    VSCodeButton,
    VSCodeDataGrid,
    VSCodeDataGridCell,
    VSCodeDataGridRow,
    VSCodeDropdown,
    VSCodeOption,
} from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render } from '../utilities/render';
import { useEffect, useState } from 'react';
import { TEventHub, TMesssage, TResourceGroup, TSubscription } from './types';

const MainPanel = () => {
    const [subscriptions, setSubscriptions] = useState<TSubscription[]>();
    const [resourceGroups, setResourceGroups] = useState<TResourceGroup[]>();
    const [eventHubs, setEventHubs] = useState<TEventHub[]>();
    const [selectedSubscription, setSelectedSubscription] = useState<TSubscription>();
    const [selectedResourceGroup, setSelectedResourceGroup] = useState<TResourceGroup>();
    const [selectedEventHub, setSelectedEventHub] = useState<TEventHub>();

    const [messages, setMessages] = useState<TMesssage[]>();
    const [selectedMessages, setSelectedMessages] = useState<TMesssage | undefined>();

    useEffect(() => {
        setSubscriptions([
            { name: 'test-1', id: 'test-1' },
            { name: 'test-2', id: 'test-2' },
        ]);

        setResourceGroups([
            { name: 'test-1', id: 'test-1' },
            { name: 'test-2', id: 'test-2' },
        ]);

        setEventHubs([
            { name: 'test-1', id: 'test-1' },
            { name: 'test-2', id: 'test-2' },
        ]);

        setMessages([
            { message: 'test-123' },
            { message: 'test-423' },
            { message: 'test-23423' },
            { message: 'test-1255553' },
        ]);
    }, []);

    useEffect(() => {
        if (subscriptions !== undefined && resourceGroups !== undefined && eventHubs !== undefined) {
            setSelectedSubscription(subscriptions.at(0));
            setSelectedResourceGroup(resourceGroups.at(0));
            setSelectedEventHub(eventHubs.at(0));
        }
    }, [subscriptions, resourceGroups, eventHubs]);

    const handleSubscriptionChange = (event: any) => {
        if (subscriptions === undefined) {
            return;
        }

        const element: TSubscription | undefined = subscriptions[event.target.selectedIndex];

        if (element === undefined) {
            return;
        }

        console.log(element);

        setSelectedSubscription(element);
    };

    const handleResourceGroupChange = (event: any) => {
        if (resourceGroups === undefined) {
            return;
        }

        const element: TResourceGroup | undefined = resourceGroups[event.target.selectedIndex];

        if (element === undefined) {
            return;
        }

        console.log(element);

        setSelectedResourceGroup(element);
    };

    const handleEventHubChange = (event: any) => {
        if (eventHubs === undefined) {
            return;
        }

        const element: TEventHub | undefined = eventHubs[event.target.selectedIndex];

        if (element === undefined) {
            return;
        }

        console.log(element);

        setSelectedEventHub(element);
    };

    const handleMessageActive = (message: TMesssage) => {
        setSelectedMessages(message);
    };

    return (
        <main className="main-panel">
            <div className="main-panel__header">
                <VSCodeDropdown
                    value={selectedSubscription?.name}
                    onChange={handleSubscriptionChange}
                    className="main-panel__header_dropdown">
                    {subscriptions?.map((x) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeDropdown
                    value={selectedResourceGroup?.name}
                    onChange={handleResourceGroupChange}
                    className="main-panel__header_dropdown">
                    {resourceGroups?.map((x) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeDropdown
                    value={selectedEventHub?.name}
                    onChange={handleEventHubChange}
                    className="main-panel__header_dropdown">
                    {eventHubs?.map((x) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeButton className="main-panel__header_button">Send Message</VSCodeButton>
            </div>
            <div className="main-panel__wrapper">
                <div className="main-panel__wrapper-colunm"></div>
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid>
                        <VSCodeDataGridRow gridTemplateColumns="1fr 11fr" rowType="header">
                            <VSCodeDataGridCell gridColumn="1">Index</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn="2">Message</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {messages?.map((x, index) => (
                            <VSCodeDataGridRow gridTemplateColumns="1fr 11fr" onClick={() => handleMessageActive(x)}>
                                <VSCodeDataGridCell gridColumn="1">{index}</VSCodeDataGridCell>
                                <VSCodeDataGridCell gridColumn="2">{x.message}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
                </div>
                <div className="main-panel__wrapper-colunm"></div>
            </div>
        </main>
    );
};

render(<MainPanel />);
