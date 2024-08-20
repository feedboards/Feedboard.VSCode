import { useState } from 'react';
import { useLayout, ELayoutTypes } from '..';
import { EditAndAddNewConnection, ConnectionList, Header } from './components';
import { TConnection } from '@feedboard/feedboard.core';

export const Layout = () => {
    const { layoutType, hasHeader } = useLayout();
    const [connection, setConnection] = useState<TConnection | undefined>(undefined);

    return (
        <main className="main-side-bar">
            {layoutType === ELayoutTypes.connectionList && <Header />}
            <div className="main-side-bar__wrapper" data-has-header={hasHeader}>
                {layoutType === ELayoutTypes.connectionList && <ConnectionList setConnection={setConnection} />}
                {layoutType === ELayoutTypes.addOrEditConnection && (
                    <EditAndAddNewConnection connection={connection} setConnection={setConnection} />
                )}
            </div>
        </main>
    );
};
