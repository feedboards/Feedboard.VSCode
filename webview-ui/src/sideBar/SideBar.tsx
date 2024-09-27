import { render } from '../utilities';
import '../scss/sideBar.scss';
import { useState } from 'react';
import { TConnection } from '@feedboard/feedboard.core';
import { ConnectionList, EditAndAddNewConnection, Header, Settings } from './components';
import { GlobalProvider, LayoutProvider, useLayout } from './contexts';
import { ELayoutTypes } from './types';

const MainSideBar = (): JSX.Element => {
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
                {layoutType === ELayoutTypes.settings && <Settings />}
            </div>
        </main>
    );
};

render(
    <GlobalProvider>
        <LayoutProvider>
            <MainSideBar />
        </LayoutProvider>
    </GlobalProvider>
);
