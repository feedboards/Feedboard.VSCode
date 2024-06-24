import classNames from 'classnames';
import { useLayout, ELayoutTypes } from '..';
import {
    HeaderWithAzureOAuth,
    HeaderWithConnectionString,
    PanelWithAzureOAuth,
    PanelWithConnectionString,
} from './components';

export const Layout = () => {
    const { layoutType } = useLayout();

    return (
        <main className="main-panel">
            {layoutType === ELayoutTypes.withAzureOAuth && <HeaderWithAzureOAuth />}
            {layoutType === ELayoutTypes.withConnectionString && <HeaderWithConnectionString />}
            <div
                className={classNames('main-panel__wrapper', {
                    ['main-panel__wrapper-connectionString']: layoutType === ELayoutTypes.withConnectionString,
                })}>
                {layoutType === ELayoutTypes.withAzureOAuth && <PanelWithAzureOAuth />}
                {layoutType === ELayoutTypes.withConnectionString && <PanelWithConnectionString half />}
            </div>
        </main>
    );
};
