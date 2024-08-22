import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { useState } from 'react';
import { useLayout } from '../contexts';
import { ELayoutTypes } from '../types';

export const ChangeLayoutButtons = (): JSX.Element => {
    const [activeButtons, setActiveButtons] = useState<boolean[]>([true, false]);

    const { changeLayoutType } = useLayout();

    const changeDisplayJson = (layoutType: ELayoutTypes, active: boolean) => {
        setActiveButtons([active, !active]);
        changeLayoutType(layoutType);
    };

    return (
        <>
            <VSCodeButton
                className="main-panel__header_button-toggle"
                appearance={activeButtons[0] ? 'primary' : 'secondary'}
                onClick={() => changeDisplayJson(ELayoutTypes.withAzureOAuth, true)}>
                Azure Account
            </VSCodeButton>
            <VSCodeButton
                className="main-panel__header_button-toggle"
                appearance={activeButtons[1] ? 'primary' : 'secondary'}
                onClick={() => changeDisplayJson(ELayoutTypes.withConnectionString, false)}>
                Connection string
            </VSCodeButton>
        </>
    );
};
