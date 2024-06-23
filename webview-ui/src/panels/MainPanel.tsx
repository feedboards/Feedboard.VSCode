import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render, vscode } from '../utilities';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';
import { Eventhub } from '@azure/arm-eventhub';
import { EMainPanelCommands } from '../../../src/helpers';
import { GlobalProvider, Header, addLoading, useGlobal } from '.';

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

render(
    <GlobalProvider>
        <MainPanel />
    </GlobalProvider>
);
