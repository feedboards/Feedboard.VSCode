import { GlobalProvider, LayoutProvider } from '.';
import { render } from '../../utilities';
import { Layout } from './layouts';
import '../../scss/mainSideBar.scss';

render(
    <GlobalProvider>
        <LayoutProvider>
            <Layout />
        </LayoutProvider>
    </GlobalProvider>
);
