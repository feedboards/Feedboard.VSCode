import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, commands } from 'vscode';
import { getUri, getNonce } from '../utilities';
import {
    isString,
    isTMainPanelGetConsumerGroups,
    isTMainPanelGetEventHubs,
    isTMainPanelStartMonitoring,
    isTMainPanelStartMonitoringByConnectionString,
    TMainPanelPayload,
} from '../../common/types';
import { EPanelCommands } from '../../common/commands';
import { AzureClient, AzureEventHub, AzureToken, TAzureTokenResponseDto, TConnection } from '@feedboard/feedboard.core';
import { TokenHelper } from '../helpers';

export class Panel {
    private readonly _tokenHelper: TokenHelper;

    private _disposables: Disposable[] = [];
    private _token: AzureToken;
    private _azureEventHub: AzureEventHub;
    private _azureClient: AzureClient | undefined;
    private _webview: Webview | undefined;

    private static _openPanels: { [id: string]: Panel } = {};

    private constructor(
        private _panel: WebviewPanel,
        private readonly _extensionUri: Uri,
        private _connection: TConnection
    ) {
        this._token = new AzureToken();
        this._tokenHelper = new TokenHelper();
        this._azureEventHub = new AzureEventHub();

        this._tokenHelper.getAzureToken().then((token) => {
            if (!token) {
                return;
            }

            this._azureClient = new AzureClient(token);
            this._token.addTokenOrUpdate(token.getActiveTokenAsResponseDto());

            if (this._webview) {
                this._webview.postMessage({
                    command: EPanelCommands.setIsLoggedInAzure,
                    payload: this._token.isLogged(),
                });
            }
        });

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.html = this._getWebviewContent(this._panel.webview);
        this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri, connection: TConnection) {
        if (Panel._openPanels[connection.id] !== undefined) {
            Panel._openPanels[connection.id]._panel.reveal(ViewColumn.One);
        } else {
            const panel = window.createWebviewPanel('showHelloWorld', 'feedboard', ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [Uri.joinPath(extensionUri, 'out'), Uri.joinPath(extensionUri, 'webview-ui/build')],
            });

            Panel._openPanels[connection.id] = new Panel(panel, extensionUri, connection);
        }
    }

    public dispose() {
        delete Panel._openPanels[this._connection.id];

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();

            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: Webview) {
        const nonce = getNonce();

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en" class="main-panel__html">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="${getUri(webview, this._extensionUri, [
                    'webview-ui',
                    'build',
                    'panel.css',
                ])}">
                <title>feedboard</title>
            </head>
            <body class="main-panel__body">
                <div id="root" class="main-panel__root"></div>
                <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'panel.js',
        ])}"></script>
        <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'VSCodeInput.js',
        ])}"></script>
            </body>
        </html>
        `;
    }

    private _setWebviewMessageListener(webview: Webview) {
        this._webview = webview;

        webview.onDidReceiveMessage(
            async (message: { command: EPanelCommands; payload: TMainPanelPayload }) => {
                const payload = message.payload;

                switch (message.command) {
                    case EPanelCommands.startMonitoring:
                        if (
                            !this._token.isLogged() ||
                            !isTMainPanelStartMonitoring(payload) ||
                            this._azureEventHub.isMonitoring()
                        ) {
                            return;
                        }

                        this._azureEventHub.startMonitoringByOAuth(
                            {
                                subscriptionId: payload.subscriptionId,
                                resourceGroupName: payload.resourceGroupName,
                                namespaceName: payload.namespaceName,
                                consumerGroupName: payload.consumerGroupName,
                                eventHubName: payload.eventHubName,
                            },
                            this._token,
                            async (events, _) => {
                                const result: any[] = [];
                                events.forEach((x) => {
                                    if (
                                        x.body !== undefined ||
                                        x.body !== null ||
                                        (Array.isArray(x.body) && x.body.length > 0)
                                    ) {
                                        result.push(...x.body);
                                    }
                                });
                                if (result.length > 0) {
                                    await webview.postMessage({
                                        command: EPanelCommands.setMessages,
                                        payload: result,
                                    });
                                }
                            }
                        );
                        break;

                    case EPanelCommands.startMonitoringByConnectionString:
                        if (!isTMainPanelStartMonitoringByConnectionString(payload)) {
                            return;
                        }

                        this._azureEventHub.startMonitoringByConnectionString(
                            {
                                consumerGroupName: payload.consumerGroupName,
                                connectionString: payload.connectionString,
                                eventHubName: payload.eventHubName,
                            },
                            async (events, _) => {
                                const result: any[] = [];

                                events.forEach((x) => {
                                    if (
                                        x.body !== undefined ||
                                        x.body !== null ||
                                        (Array.isArray(x.body) && x.body.length > 0)
                                    ) {
                                        result.push(...x.body);
                                    }
                                });

                                // TODO delete
                                console.log('result', result);

                                if (result.length > 0) {
                                    await webview.postMessage({
                                        command: EPanelCommands.setMessages,
                                        payload: result,
                                    });
                                }
                            }
                        );
                        break;

                    case EPanelCommands.stopMonitoring:
                        if (this._azureEventHub.isMonitoring() && this._azureEventHub !== undefined) {
                            await this._azureEventHub.stopMonitoring();
                        }
                        break;

                    case EPanelCommands.getConnection:
                        await webview.postMessage({
                            command: EPanelCommands.setConnection,
                            payload: this._connection,
                        });
                        break;

                    case EPanelCommands.getEventHubs:
                        console.log('EMainPanelCommands.getEventHubs');
                        if (this._azureClient !== undefined && isTMainPanelGetEventHubs(payload)) {
                            const result = await this._azureClient.getEventHubsByNamespace(
                                payload.subscriptionId,
                                payload.resourceGroupName,
                                payload.namespaceName
                            );

                            console.log('result of the getEventHubs command', result);

                            await webview.postMessage({
                                command: EPanelCommands.setEventHubs,
                                payload: result,
                            });
                        }
                        break;

                    case EPanelCommands.getConsumerGroups:
                        console.log('payload from getConsumerGroups command', payload);
                        if (this._azureClient !== undefined && isTMainPanelGetConsumerGroups(payload)) {
                            await webview.postMessage({
                                command: EPanelCommands.setConsumerGroups,
                                payload: await this._azureClient.getConsumerGroups(
                                    payload.subscriptionId,
                                    payload.resourceGroupName,
                                    payload.namespaceName,
                                    payload.eventHubName
                                ),
                            });
                        }
                        break;

                    case EPanelCommands.getIsLoggedInAzure:
                        await webview.postMessage({
                            command: EPanelCommands.setIsLoggedInAzure,
                            payload: this._token.isLogged(),
                        });
                        break;

                    case EPanelCommands.singInWithAzure:
                        const result = await commands.executeCommand<TAzureTokenResponseDto>(
                            'feedboard.singInWithAzure'
                        );

                        try {
                            this._token.addTokenOrUpdate(result);
                            this._azureClient = new AzureClient(this._token);
                            await this._tokenHelper.createAzureToken(result);

                            await webview.postMessage({
                                command: EPanelCommands.setIsLoggedInAzure,
                                payload: this._token.isLogged(),
                            });
                        } catch (error) {
                            // TODO implemtnt catch
                        }
                        break;

                    case EPanelCommands.showError:
                        if (isString(payload)) {
                            window.showErrorMessage(payload);
                        }
                        break;
                }
            },
            undefined,
            this._disposables
        );
    }
}
