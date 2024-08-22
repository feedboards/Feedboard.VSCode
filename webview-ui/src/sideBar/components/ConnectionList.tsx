import { TConnection } from '@feedboard/feedboard.core';
import { useGlobal, useLayout } from '../contexts';
import { ELayoutTypes, IConnectionList } from '../types';
import { vscode } from '../../utilities';
import { ESideBarCommands } from '../../../../common/commands';
import { DeleteIcon, EditIcon } from '../../icons';

export const ConnectionList = ({ setConnection }: IConnectionList) => {
    const { savedConnections, removeConnection } = useGlobal();
    const { changeLayoutType } = useLayout();

    const onOpen = (connection: TConnection) => {
        vscode.postMessage({
            command: ESideBarCommands.openConnection,
            payload: connection,
        });
    };

    const onEdit = (connection: TConnection) => {
        changeLayoutType(ELayoutTypes.addOrEditConnection);
        setConnection(connection);
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
                    <DeleteIcon className="main-side-bar__connection_icon" onClick={() => removeConnection(x)} />
                </div>
            ))}
        </div>
    );
};
