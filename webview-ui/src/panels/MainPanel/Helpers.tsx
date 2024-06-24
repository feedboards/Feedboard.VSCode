import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { ReactElement } from 'react';

export const addLoading = (state: boolean, Options: ReactElement) => {
    return (
        <>
            {state && (
                <div className="main-panel__loading">
                    <div>Loading...</div>
                    <VSCodeProgressRing />
                </div>
            )}
            {!state && Options}
        </>
    );
};
