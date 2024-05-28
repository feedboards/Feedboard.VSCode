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
import { TEventHub, TMesssage, TResourceGroup, TSubscription, TTopics } from './types';

const MainPanel = () => {
    // Dropdown States
    const [subscriptions, setSubscriptions] = useState<TSubscription[]>();
    const [resourceGroups, setResourceGroups] = useState<TResourceGroup[]>();
    const [eventHubs, setEventHubs] = useState<TEventHub[]>();
    const [topics, setTopics] = useState<TTopics[]>();
    const [selectedSubscription, setSelectedSubscription] = useState<TSubscription | undefined>(undefined);
    const [selectedResourceGroup, setSelectedResourceGroup] = useState<TResourceGroup | undefined>(undefined);
    const [selectedEventHub, setSelectedEventHub] = useState<TEventHub | undefined>(undefined);

    const [messages, setMessages] = useState<TMesssage[] | undefined>(undefined);
    const [selectedMessages, setSelectedMessages] = useState<TMesssage | undefined>(undefined);

    // TODO Clean up this useEffect
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

        setTopics([{ name: 'test-123' }, { name: 'test-423' }, { name: 'test-23423' }, { name: 'test-1255553' }]);
    }, []);

    useEffect(() => {
        if (subscriptions !== undefined && resourceGroups !== undefined && eventHubs !== undefined) {
            setSelectedSubscription(subscriptions.at(0));
            setSelectedResourceGroup(resourceGroups.at(0));
            setSelectedEventHub(eventHubs.at(0));
        }
    }, [subscriptions, resourceGroups, eventHubs]);

    function handleDropdownChange<TState>(event: any, setState: Function, state: TState[]) {
        const element: TState | undefined = state[event.target.selectedIndex];

        if (element === undefined) {
            return;
        }

        console.log(typeof state, element);

        setState(element);
    }

    const handleMessageActive = (message: TMesssage) => {
        setSelectedMessages(message);
    };

    return (
        <main className="main-panel">
            <div className="main-panel__header">
                <VSCodeDropdown
                    value={selectedSubscription?.name}
                    onChange={(x) =>
                        subscriptions && handleDropdownChange<TSubscription>(x, setSelectedSubscription, subscriptions)
                    }
                    className="main-panel__header_dropdown">
                    {subscriptions?.map((x: TSubscription) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeDropdown
                    value={selectedResourceGroup?.name}
                    onChange={(x) =>
                        resourceGroups &&
                        handleDropdownChange<TResourceGroup>(x, setSelectedResourceGroup, resourceGroups)
                    }
                    className="main-panel__header_dropdown">
                    {resourceGroups?.map((x: TResourceGroup) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeDropdown
                    value={selectedEventHub?.name}
                    onChange={(x) => eventHubs && handleDropdownChange<TEventHub>(x, setSelectedEventHub, eventHubs)}
                    className="main-panel__header_dropdown">
                    {eventHubs?.map((x: TEventHub) => (
                        <VSCodeOption key={x.id}>{x.name}</VSCodeOption>
                    ))}
                </VSCodeDropdown>
                <VSCodeButton className="main-panel__header_button">Send Message</VSCodeButton>
            </div>
            <div className="main-panel__wrapper">
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid>
                        <VSCodeDataGridRow rowType="header">
                            <VSCodeDataGridCell gridColumn="1">Topics</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {topics?.map((x: TTopics) => (
                            <VSCodeDataGridRow>
                                <VSCodeDataGridCell gridColumn="1">{x.name}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
                </div>
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid gridTemplateColumns="1fr 11fr">
                        <VSCodeDataGridRow rowType="header">
                            <VSCodeDataGridCell gridColumn="1">Index</VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn="2">Message</VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {messages?.map((x: TMesssage, index: number) => (
                            <VSCodeDataGridRow onClick={() => handleMessageActive(x)}>
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
