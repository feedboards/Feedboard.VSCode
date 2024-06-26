import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import { useGlobal } from '../../contexts';
import { EMainSideBarCommands, TConnection } from '../../../../../../src/helpers';
import { vscode } from '../../../../utilities';

export const ConnectionList = () => {
    const { savedConnections } = useGlobal();

    const onOpen = (connection: TConnection) => {
        vscode.postMessage({
            command: EMainSideBarCommands.openConnection,
            payload: connection,
        });
    };

    return (
        <VSCodeDataGrid>
            <VSCodeDataGridRow rowType="header">
                <VSCodeDataGridCell gridColumn="1">Connection Name</VSCodeDataGridCell>
            </VSCodeDataGridRow>

            {savedConnections?.map((x) => (
                <VSCodeDataGridRow onClick={() => onOpen(x)}>
                    <VSCodeDataGridCell gridColumn="1">{x.name}</VSCodeDataGridCell>
                </VSCodeDataGridRow>
            ))}
        </VSCodeDataGrid>
    );
};
