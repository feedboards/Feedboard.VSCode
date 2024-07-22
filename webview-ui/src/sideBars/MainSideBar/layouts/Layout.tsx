import { useState } from 'react';
import { useLayout, ELayoutTypes } from '..';
import { EditAndAddNewConnection, ConnectionList, Header } from './components';
import { TConnection } from '../../../../../common/types';

export const Layout = () => {
    const { layoutType, hasHeader } = useLayout();
    const [connection, setConnection] = useState<TConnection | undefined>(undefined);

    return (
        <main className="main-side-bar">
            {layoutType === ELayoutTypes.default && <Header />}
            <div className="main-side-bar__wrapper" data-has-header={hasHeader}>
                {layoutType === ELayoutTypes.default && <ConnectionList setConnection={setConnection} />}
                {layoutType === ELayoutTypes.connection && (
                    <EditAndAddNewConnection connection={connection} setConnection={setConnection} />
                )}
            </div>
        </main>
    );
};
