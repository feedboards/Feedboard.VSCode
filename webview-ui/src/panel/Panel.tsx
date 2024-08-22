import '../scss/panel.scss';
import { render } from '../utilities';
import { Header } from './components';
import classNames from 'classnames';
import { ELayoutTypes } from './types';
import { GlobalProvider, LayoutProvider, useGlobal, useLayout } from './contexts';
import { useEffect, useRef, useState } from 'react';
import { VSCodeButton, VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow } from '@vscode/webview-ui-toolkit/react';
import JsonView from '@uiw/react-json-view';
import { vscodeTheme } from '@uiw/react-json-view/vscode';

const startObject = {
    str: 'str',
};

const Panel = (): JSX.Element => {
    const [activeButtons, setActiveButtons] = useState<boolean[]>([true, false]);
    const [displayJson, setDisplayJson] = useState<boolean>(true);

    const { layoutType } = useLayout();
    const { setSelectedMessages, messages, selectedMessage } = useGlobal();

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (!displayJson && textareaRef.current) {
            if (selectedMessage === undefined) {
                textareaRef.current.value = convertToJson(startObject);
            } else {
                textareaRef.current.value = convertToJson(selectedMessage);
            }
        }
    }, [displayJson]);

    const convertToJson = (data: any) => JSON.stringify(data, null, '\t');

    const changeDisplayJson = (isJsonBtn: boolean) => {
        setActiveButtons([isJsonBtn, !isJsonBtn]);
        setDisplayJson(isJsonBtn);
    };

    return (
        <main className="main-panel">
            <Header />
            <div
                className={classNames('main-panel__wrapper', {
                    ['main-panel__wrapper-connectionString']: layoutType === ELayoutTypes.withConnectionString,
                })}>
                <div className="main-panel__wrapper-colunm">
                    <VSCodeDataGrid gridTemplateColumns="10% 90%">
                        <VSCodeDataGridRow rowType="header">
                            <VSCodeDataGridCell gridColumn="1">
                                <b>Index</b>
                            </VSCodeDataGridCell>
                            <VSCodeDataGridCell gridColumn="2">
                                <b>Message</b>
                            </VSCodeDataGridCell>
                        </VSCodeDataGridRow>

                        {messages?.map((x: any, index: number) => (
                            <VSCodeDataGridRow key={index} onClick={() => setSelectedMessages(x)}>
                                <VSCodeDataGridCell gridColumn="1">{index}</VSCodeDataGridCell>
                                <VSCodeDataGridCell gridColumn="2">{JSON.stringify(x)}</VSCodeDataGridCell>
                            </VSCodeDataGridRow>
                        ))}
                    </VSCodeDataGrid>
                </div>
                <div className="main-panel__wrapper-colunm main-panel__wrapper_json">
                    <div className="main-panel__wrapper_json-header">
                        <VSCodeButton
                            className="main-panel__wrapper_json-header_button"
                            appearance={activeButtons[0] ? 'primary' : 'secondary'}
                            onClick={() => changeDisplayJson(true)}>
                            Json
                        </VSCodeButton>
                        <VSCodeButton
                            className="main-panel__wrapper_json-header_button"
                            appearance={activeButtons[1] ? 'primary' : 'secondary'}
                            onClick={() => changeDisplayJson(false)}>
                            Raw
                        </VSCodeButton>
                    </div>
                    {displayJson ? (
                        <JsonView
                            value={selectedMessage !== undefined ? selectedMessage : startObject}
                            style={vscodeTheme}
                        />
                    ) : (
                        <textarea ref={textareaRef} className="main-panel__wrapper_json-body_area" readOnly />
                    )}
                </div>
            </div>
        </main>
    );
};

render(
    <GlobalProvider>
        <LayoutProvider>
            <Panel />
        </LayoutProvider>
    </GlobalProvider>
);
