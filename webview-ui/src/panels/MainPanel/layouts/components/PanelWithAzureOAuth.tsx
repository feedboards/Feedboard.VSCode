import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import { addLoading, useGlobal } from '../..';
import { Eventhub } from '@azure/arm-eventhub';
import { vscode } from '../../../../utilities';
import { EMainPanelCommands } from '../../../../../../src/helpers';
import { PanelWithConnectionString } from './PanelWithConnectionString';

export const PanelWithAzureOAuth = () => {
    const {
        setSelectedEventHub,
        setConsumerGroupLoading,
        selectedSubscription,
        selectedResourceGroup,
        selectedNamespace,
        eventHubLoading,
        eventHubs,
    } = useGlobal();

    return (
        <>
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
            <PanelWithConnectionString />
        </>
    );
};
