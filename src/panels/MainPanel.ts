import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, commands } from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';
import { AzureClient, AzureTokenResponse, EventHubClient, TokenHelper } from '../core';
import {
    TMainPanelPayload,
    EMainPanelCommands,
    isTMainPanelGetResourceGroups,
    isTMainPanelGetNamespaces,
    isTMainPanelGetEventHubs,
    isTMainPanelGetConsumerGroups,
    isTMainPanelStartMonitoring,
} from '../helpers';
import { MainPanelConstants } from '../constants';

export class MainPanel {
    public static currentPanel: MainPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private readonly _tokenHelper: TokenHelper;
    private _eventHubClient: EventHubClient | undefined;
    private _azureClient: AzureClient | undefined;
    // private _azureToken: TokenCredential | null = null;
    // private _isLoggedInAzure: boolean = false;
    private _webview: Webview | undefined;

    private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
        this._panel = panel;
        this._tokenHelper = new TokenHelper(context);
        this._tokenHelper.getAzureToken().then((token) => {
            if (token !== null) {
                MainPanelConstants.azureToken = token;
                this._azureClient = new AzureClient(token);

                if (this._webview !== undefined) {
                    this._webview.postMessage({
                        command: EMainPanelCommands.setIsLoggedInAzure,
                        payload: true,
                    });
                }
            }
        });

        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

        this._setWebviewMessageListener(this._panel.webview);
    }

    public static render(extensionUri: Uri, context: ExtensionContext) {
        if (MainPanel.currentPanel) {
            MainPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            const panel = window.createWebviewPanel('showHelloWorld', 'feedboard', ViewColumn.One, {
                enableScripts: true,
                localResourceRoots: [Uri.joinPath(extensionUri, 'out'), Uri.joinPath(extensionUri, 'webview-ui/build')],
            });

            MainPanel.currentPanel = new MainPanel(panel, extensionUri, context);
        }
    }

    public dispose() {
        MainPanel.currentPanel = undefined;

        this._panel.dispose();

        while (this._disposables.length) {
            const disposable = this._disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }

    private _getWebviewContent(webview: Webview, extensionUri: Uri) {
        const nonce = getNonce();

        return /*html*/ `
        <!DOCTYPE html>
        <html lang="en" class="main-panel__html">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="stylesheet" type="text/css" href="${getUri(webview, extensionUri, [
                    'webview-ui',
                    'build',
                    'assets',
                    'mainPanel.css',
                ])}">
                <title>feedboard</title>
            </head>
            <body class="main-panel__body">
                <div id="root" class="main-panel__root"></div>
                <script type="module" nonce="${nonce}" src="${getUri(webview, extensionUri, [
            'webview-ui',
            'build',
            'assets',
            'mainPanel.js',
        ])}"></script>
                        <script type="module" nonce="${nonce}" src="${getUri(webview, extensionUri, [
            'webview-ui',
            'build',
            'assets',
            'jsx-runtime.js',
        ])}"></script>
            </body>
        </html>
        `;
    }

    private _setWebviewMessageListener(webview: Webview) {
        this._webview = webview;

        webview.onDidReceiveMessage(
            async (message: { command: EMainPanelCommands; payload: TMainPanelPayload }) => {
                const payload = message.payload;

                switch (message.command) {
                    case EMainPanelCommands.startMonitoring:
                        if (MainPanelConstants.azureToken !== null && isTMainPanelStartMonitoring(payload)) {
                            const rules = await this._azureClient?.getAuthorizationRules(
                                payload?.subscriptionId,
                                payload?.resourceGroupName,
                                payload?.namespaceName
                            );

                            if (rules !== undefined) {
                                const defaultRule = rules.find((x) => x.name === 'RootManageSharedAccessKey');

                                if (defaultRule !== undefined && defaultRule.name !== undefined) {
                                    const key = await this._azureClient?.getKeys(
                                        payload.subscriptionId,
                                        payload.resourceGroupName,
                                        payload.namespaceName,
                                        defaultRule.name
                                    );

                                    if (key?.primaryConnectionString !== undefined) {
                                        this._eventHubClient = new EventHubClient(
                                            payload.consumerGroupName,
                                            payload.eventHubName,
                                            key?.primaryConnectionString
                                        );

                                        console.log('isMonitoring', MainPanelConstants.isMonitoring);

                                        if (!MainPanelConstants.isMonitoring) {
                                            console.log('isMonitoring on');
                                            this._eventHubClient.startMonitoring(async (events, _) => {
                                                console.log(events, _);
                                                const result: any[] = [];

                                                events.forEach((x) => {
                                                    console.log('body', x.body);

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
                                                        command: EMainPanelCommands.setMessages,
                                                        payload: result,
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            }
                        }
                        break;

                    case EMainPanelCommands.stopMonitoring:
                        if (MainPanelConstants.isMonitoring && this._eventHubClient !== undefined) {
                            await this._eventHubClient.stopMonitoring();
                        }
                        break;

                    case EMainPanelCommands.getSubscriptions:
                        if (this._azureClient !== undefined) {
                            await webview.postMessage({
                                command: EMainPanelCommands.setSubscriptions.toString(),
                                payload: await this._azureClient.getSubscriptions(),
                            });
                        }
                        break;

                    case EMainPanelCommands.getResourceGroups:
                        if (this._azureClient !== undefined && isTMainPanelGetResourceGroups(payload)) {
                            await webview.postMessage({
                                command: EMainPanelCommands.setResourceGroups,
                                payload: await this._azureClient.getResourceGroups(payload.subscriptionId),
                            });
                        }
                        break;

                    case EMainPanelCommands.getNamespaces:
                        if (this._azureClient !== undefined && isTMainPanelGetNamespaces(payload)) {
                            await webview.postMessage({
                                command: EMainPanelCommands.setNamespaces,
                                payload: await this._azureClient.getNamespacesByResourceGroup(
                                    payload.subscriptionId,
                                    payload.resourceGroupName
                                ),
                            });
                        }
                        break;

                    case EMainPanelCommands.getEventHubs:
                        if (this._azureClient !== undefined && isTMainPanelGetEventHubs(payload)) {
                            await webview.postMessage({
                                command: EMainPanelCommands.setEventHubs,
                                payload: await this._azureClient.getEventHubsByNamespace(
                                    payload.subscriptionId,
                                    payload.resourceGroupName,
                                    payload.namespaceName
                                ),
                            });
                        }
                        break;

                    case EMainPanelCommands.getConsumerGroups:
                        if (this._azureClient !== undefined && isTMainPanelGetConsumerGroups(payload)) {
                            await webview.postMessage({
                                command: EMainPanelCommands.setConsumerGroups,
                                payload: await this._azureClient.getConsumerGroups(
                                    payload.subscriptionId,
                                    payload.resourceGroupName,
                                    payload.namespaceName,
                                    payload.eventHubName
                                ),
                            });
                        }
                        break;

                    case EMainPanelCommands.getIsLoggedInAzure:
                        await webview.postMessage({
                            command: EMainPanelCommands.setIsLoggedInAzure,
                            payload: MainPanelConstants.isLoggedInAzure,
                        });
                        break;

                    case EMainPanelCommands.singInWithAzure:
                        const result = await commands.executeCommand<AzureTokenResponse>('feedboard.singInWithAzure');

                        MainPanelConstants.azureToken = this._tokenHelper.createAzureToken(
                            result.accessToken,
                            result.accessTokenExpiredAt
                        );

                        if (MainPanelConstants.azureToken !== null) {
                            this._azureClient = new AzureClient(MainPanelConstants.azureToken);

                            await webview.postMessage({
                                command: EMainPanelCommands.setIsLoggedInAzure,
                                payload: true,
                            });
                        }
                        break;
                }
            },
            undefined,
            this._disposables
        );
    }
}
