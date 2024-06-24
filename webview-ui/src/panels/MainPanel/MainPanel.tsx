import '../../scss/mainPanel.scss';
import { Layout, GlobalProvider, LayoutProvider, render } from '.';

render(
    <GlobalProvider>
        <LayoutProvider>
            <Layout />
        </LayoutProvider>
    </GlobalProvider>
);
