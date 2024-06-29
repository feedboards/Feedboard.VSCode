import { ELayoutTypes, IConnectionList, useGlobal, useLayout } from '../..';
import { EMainSideBarCommands, TConnection } from '../../../../../../src/helpers';
import { vscode } from '../../../../utilities';
import { EditIcon } from '../../../../icons';

export const ConnectionList = ({ setConnection }: IConnectionList) => {
    const { savedConnections } = useGlobal();
    const { changeLayoutType } = useLayout();

    const onOpen = (connection: TConnection) => {
        vscode.postMessage({
            command: EMainSideBarCommands.openConnection,
            payload: connection,
        });
    };

    const onEdit = (connection: TConnection) => {
        changeLayoutType(ELayoutTypes.connection);
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
                </div>
            ))}
        </div>
    );
};
