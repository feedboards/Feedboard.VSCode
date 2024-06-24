import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import { EMainPanelCommands } from '../../../../../../src/helpers';
import { vscode } from '../../../../utilities';
import { VSCodeInput } from '../../components';
import { ChangeEvent, useState } from 'react';
import { ChangeLayoutButtons } from '.';

export const HeaderWithConnectionString = () => {
    const [connectionString, setConnectionString] = useState<string | null>(null);
    const [eventHubName, setEventHubName] = useState<string | null>(null);
    const [consumerGroupName, setConsumerGroupName] = useState<string | null>('$Default');

    const setData = (event: ChangeEvent<HTMLInputElement>, setState: (value: string | null) => void) => {
        if (event.target.value !== undefined && event.target.value !== '') {
            setState(event.target.value);
        }
    };

    const startMonitoring = (): void => {
        const showError = (message: string): void => {
            vscode.postMessage({
                command: EMainPanelCommands.showError,
                payload: message,
            });
        };

        if (connectionString === null) {
            showError('Please enter connection string');
            return;
        }

        if (eventHubName === null) {
            showError('Please enter event hub name');
            return;
        }

        vscode.postMessage({
            command: EMainPanelCommands.startMonitoringByConnectionString,
            payload: {
                eventHubName,
                consumerGroupName,
                connectionString,
            },
        });
    };

    return (
        <div className="main-panel__header">
            <div className="main-panel__header_input_group">
                <VSCodeInput
                    className="main-panel__header_input"
                    placeholder="Connection string"
                    onChange={(x) => setData(x, setConnectionString)}
                />
                <VSCodeInput
                    className="main-panel__header_input"
                    placeholder="EventHub name"
                    onChange={(x) => setData(x, setEventHubName)}
                />
                <VSCodeInput
                    className="main-panel__header_input"
                    placeholder="Consumer group name (optional)"
                    onChange={(x) => setData(x, setConsumerGroupName)}
                />
            </div>
            <VSCodeButton className="main-panel__header_button" onClick={startMonitoring}>
                Connect
            </VSCodeButton>
            <ChangeLayoutButtons />
        </div>
    );
};
