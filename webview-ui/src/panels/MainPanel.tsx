import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render, vscode } from '../utilities';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { Eventhub } from '@azure/arm-eventhub';
import { EMainPanelCommands } from '../../../src/helpers';
import { GlobalProvider, Header, addLoading, useGlobal } from '.';
import { useEffect, useRef, useState } from 'react';

const MainPanel = () => {
    const {
        setSelectedEventHub,
        setConsumerGroupLoading,
        setSelectedMessages,
        messages,
        selectedMessage,
        selectedSubscription,
        selectedResourceGroup,
        selectedNamespace,
        eventHubLoading,
        eventHubs,
    } = useGlobal();

    const [activeButtons, setActiveButtons] = useState<boolean[]>([false, true]);
    const [displayJson, setDisplayJson] = useState<boolean>(true);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const startObject = {
        str: 'str',
    };

    useEffect(() => {
        if (!displayJson && textareaRef.current) {
            if (selectedMessage === undefined) {
                textareaRef.current.value = JSON.stringify(startObject, null, '\t');
            } else {
                textareaRef.current.value = JSON.stringify(selectedMessage, null, '\t');
            }
        }
    }, [displayJson]);

    const changeDisplayJson = (value: boolean) => {
        setActiveButtons([!value, value]);
        setDisplayJson(value);
    };

    return (
        <main className="main-panel">
            <Header />
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
                    <div className="main-panel__wrapper_json">
                        <div className="main-panel__wrapper_json-header">
                            <VSCodeButton
                                className="main-panel__wrapper_json-header_button"
                                disabled={!activeButtons[0]}
                                appearance={activeButtons[0] ? 'primary' : 'secondary'}
                                onClick={() => changeDisplayJson(activeButtons[0])}>
                                Json
                            </VSCodeButton>
                            <VSCodeButton
                                className="main-panel__wrapper_json-header_button"
                                disabled={!activeButtons[1]}
                                appearance={activeButtons[1] ? 'primary' : 'secondary'}
                                onClick={() => changeDisplayJson(!activeButtons[1])}>
                                Row
                            </VSCodeButton>
                        </div>
                        {displayJson ? (
                            <JsonView
                                value={selectedMessage !== undefined ? selectedMessage : startObject}
                                style={vscodeTheme}
                            />
                        ) : (
                            <textarea ref={textareaRef} className="main-panel__wrapper_json-body_area" readOnly />
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

render(
    <GlobalProvider>
        <MainPanel />
    </GlobalProvider>
);
