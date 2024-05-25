import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import '../css/App.css';
import { vscode } from '../utilities/vscode';
import { render } from '../utilities/render';

const MainPanel = () => {
    function handleHowdyClick() {
        vscode.postMessage({
            command: 'hello',
            text: 'Hey there partner! 🤠',
        });
    }

    return (
        <main>
            <h1>Hello World!</h1>
            <VSCodeButton onClick={handleHowdyClick}>asdfasd Howdy!</VSCodeButton>
        </main>
    );
};

render(<MainPanel />);
