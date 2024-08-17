import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import ReactDOM from 'react-dom';
import { ReactElement } from 'react';

export function handleDropdownChange<TState>(event: any, setState: Function, state: TState[]) {
    const index: number = event.target.selectedIndex - 1;
    const element: undefined | null | TState = index >= 0 ? state[index] : null;

    if (element === undefined) {
        return;
    }

    if (element === null) {
        setState(undefined);
        return;
    }

    setState(element);
}

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

export const render = (Element: ReactElement) => {
    return ReactDOM.render(Element, document.getElementById('root'));
};
