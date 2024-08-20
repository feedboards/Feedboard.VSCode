import '../../scss/mainPanel.scss';
import { Layout, GlobalProvider, LayoutProvider } from '.';
import { render } from '../../utilities';

render(
    <GlobalProvider>
        <LayoutProvider>
            <Layout />
        </LayoutProvider>
    </GlobalProvider>
);
