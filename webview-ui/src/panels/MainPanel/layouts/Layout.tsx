import classNames from 'classnames';
import { useLayout, ELayoutTypes } from '..';
import { Header, Panel } from './components';

export const Layout = () => {
    const { layoutType } = useLayout();

    return (
        <main className="main-panel">
            <Header />
            <div
                className={classNames('main-panel__wrapper', {
                    ['main-panel__wrapper-connectionString']: layoutType === ELayoutTypes.withConnectionString,
                })}>
                <Panel half />
            </div>
        </main>
    );
};
