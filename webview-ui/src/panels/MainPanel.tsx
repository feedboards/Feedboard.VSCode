import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import '../scss/mainPanel.scss';
import { render } from '../utilities/render';

const MainPanel = () => {
    return (
        <main className="main-panel">
            <div className="main-panel__header">
                <VSCodeDropdown className="main-panel__header_dropdown">
                    <VSCodeOption>test1</VSCodeOption>
                    <VSCodeOption>test2</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeDropdown className="main-panel__header_dropdown">
                    <VSCodeOption>test1</VSCodeOption>
                    <VSCodeOption>test2</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeDropdown className="main-panel__header_dropdown">
                    <VSCodeOption>test1</VSCodeOption>
                    <VSCodeOption>test2</VSCodeOption>
                </VSCodeDropdown>
                <VSCodeButton className="main-panel__header_button">Send</VSCodeButton>
            </div>
            <div className="main-panel__wrapper">
                <div className="main-panel__wrapper-colunm"></div>
                <div className="main-panel__wrapper-colunm"></div>
                <div className="main-panel__wrapper-colunm"></div>
            </div>
        </main>
    );
};

render(<MainPanel />);
