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
        <div className="main-side-bar__connection-list">
            <div className="main-side-bar__connection-list_header">
                <b>Connections</b>
            </div>
            {savedConnections?.map((x) => (
                <div className="main-side-bar__connection" onClick={() => onOpen(x)}>
                    {x.name}
                </div>
            ))}
        </div>
    );
};
