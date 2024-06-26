import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ELayoutTypes, useLayout } from '../..';

export const Header = () => {
    const { changeLayoutType } = useLayout();

    return (
        <div className="main-side-bar__header">
            <div>
                <VSCodeButton
                    className="main-side-bar__header_button"
                    onClick={() => changeLayoutType(ELayoutTypes.connection)}>
                    Add Connection
                </VSCodeButton>
            </div>
        </div>
    );
};
