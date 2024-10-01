import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useLayout } from '../contexts';
import { ELayoutTypes } from '../types';

export const Header = () => {
    const { changeLayoutType } = useLayout();

    return (
        <div className="main-side-bar__header">
            <div>
                <VSCodeButton
                    className="main-side-bar__header_button"
                    onClick={() => changeLayoutType(ELayoutTypes.addOrEditConnection)}>
                    Add Connection
                </VSCodeButton>
            </div>
            <div>
                <VSCodeButton
                    appearance="secondary"
                    className="main-side-bar__header_button"
                    onClick={() => changeLayoutType(ELayoutTypes.settings)}>
                    Settings
                </VSCodeButton>
            </div>
        </div>
    );
};
