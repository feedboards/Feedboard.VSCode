import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { ELayoutTypes } from '../types';
import { useGlobal, useLayout } from '../contexts';
import { VSCodeInput } from '../../components';
import { ChangeEvent, useEffect, useState } from 'react';
import { ESideBarCommands } from '../../../../common/commands';
import { vscode } from '../../utilities';

export const Settings = () => {
    const [inputBaseAPIUrlValue, setInputBaseAPIUrlValue] = useState<string | undefined>(undefined);
    const [inputBaseAPIUrlError, setInputBaseAPIUrlError] = useState<boolean>(false);

    const { changeLayoutType } = useLayout();
    const { baseAPIUrl, setBaseAPIUrl } = useGlobal();

    useEffect(() => {
        setInputBaseAPIUrlValue(baseAPIUrl);
    }, []);

    const onInputBaseAPIUrl = (x: ChangeEvent<HTMLInputElement>) => {
        if (x.target.value !== undefined && x.target.value !== '') {
            setInputBaseAPIUrlError(false);
        }

        setInputBaseAPIUrlValue(x.target.value);
    };

    const validateData = () => {
        if (inputBaseAPIUrlValue === undefined || inputBaseAPIUrlValue === '') {
            setInputBaseAPIUrlError(true);
        }
    };

    return (
        <div className="main-side-bar__wrapper_settings">
            <label htmlFor="baseUrl" className="main-side-bar__lable">
                Base API url
            </label>
            <VSCodeInput
                className="main-side-bar__input"
                id="baseUrl"
                isError={inputBaseAPIUrlError}
                value={inputBaseAPIUrlValue}
                placeholder="Base API url"
                onChange={onInputBaseAPIUrl}
            />
            {inputBaseAPIUrlError && <div className="main-side-bar__error-message">this field is required</div>}

            <div className="main-side-bar__wrapper_add-new-connection_button-group">
                <VSCodeButton appearance="secondary" onClick={() => changeLayoutType(ELayoutTypes.connectionList)}>
                    close
                </VSCodeButton>
                <VSCodeButton
                    onClick={() => {
                        validateData();

                        if (inputBaseAPIUrlValue) {
                            vscode.postMessage({
                                command: ESideBarCommands.addConnection,
                                payload: inputBaseAPIUrlValue,
                            });

                            setBaseAPIUrl(inputBaseAPIUrlValue);
                            changeLayoutType(ELayoutTypes.connectionList);
                        }
                    }}>
                    Save
                </VSCodeButton>
            </div>
        </div>
    );
};
