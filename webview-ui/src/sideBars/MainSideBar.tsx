import '../css/App.css';
import { render } from '../utilities/render';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';

const MainSideBar = () => {
    return (
        <>
            <main>
                <VSCodeButton style={{ width: '100%' }}>Sign in via Azure</VSCodeButton>
            </main>
        </>
    );
};

render(<MainSideBar />);
