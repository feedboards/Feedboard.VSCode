import { ELayoutTypes, IConnectionList, useGlobal, useLayout } from '../..';
import { vscode } from '../../../../utilities';
import { DeleteIcon, EditIcon } from '../../../../icons';
import { EMainSideBarCommands } from '../../../../../../common/commands';
import { TConnection } from '@feedboard/feedboard.core';

export const ConnectionList = ({ setConnection }: IConnectionList) => {
    const { savedConnections, removeConnection } = useGlobal();
    const { changeLayoutType } = useLayout();

    const onOpen = (connection: TConnection) => {
        vscode.postMessage({
            command: EMainSideBarCommands.openConnection,
            payload: connection,
        });
    };

    const onEdit = (connection: TConnection) => {
        changeLayoutType(ELayoutTypes.addOrEditConnection);
        setConnection(connection);
    };

    const onDelete = (connect: TConnection) => {
        removeConnection(connect);
    };

    return (
        <div className="main-side-bar__connection-list">
            <div className="main-side-bar__connection-list_header">
                <b>Connections</b>
            </div>
            {savedConnections?.map((x) => (
                <div className="main-side-bar__connection">
                    <div onClick={() => onOpen(x)}>{x.name}</div>
                    <EditIcon onClick={() => onEdit(x)} />
                    <DeleteIcon className="main-side-bar__connection_icon" onClick={() => onDelete(x)} />
                </div>
            ))}
        </div>
    );
};
