import { useLayout, ELayoutTypes } from '..';
import { AddNewConnection, ConnectionList, Header } from './components';

export const Layout = () => {
    const { layoutType, hasHeader } = useLayout();

    return (
        <main className="main-side-bar">
            {layoutType === ELayoutTypes.default && <Header />}
            <div className="main-side-bar__wrapper" data-has-header={hasHeader}>
                {layoutType === ELayoutTypes.default && <ConnectionList />}
                {layoutType === ELayoutTypes.connection && <AddNewConnection />}
            </div>
        </main>
    );
};
