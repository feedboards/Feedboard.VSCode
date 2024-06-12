import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn, ExtensionContext, commands } from 'vscode';
import { getUri } from '../utilities/getUri';
import { getNonce } from '../utilities/getNonce';
import { AzureClient, AzureTokenResponse, EventHubClient, TokenHelper } from '../core';
import { TokenCredential } from '@azure/identity';

/**
 * This class manages the state and behavior of HelloWorld webview panels.
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering HelloWorld webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class MainPanel {
    public static currentPanel: MainPanel | undefined;
    private readonly _panel: WebviewPanel;
    private _disposables: Disposable[] = [];

    private readonly _tokenHelper: TokenHelper;
    private _eventHubClient: EventHubClient | undefined;
    private _azureClient: AzureClient | undefined;
    private _azureToken: TokenCredential | null = null;
    private _isMonitoring: boolean = false;
    private _isLoggedInAzure: boolean = true;

    /**
     * The MainPanel class private constructor (called only from the render method).
     *
     * @param panel A reference to the webview panel
     * @param extensionUri The URI of the directory containing the extension
     */
    private constructor(panel: WebviewPanel, extensionUri: Uri, context: ExtensionContext) {
        this._panel = panel;
        this._tokenHelper = new TokenHelper(context);
        this._tokenHelper.getAzureToken().then((token) => {
            if (token !== null) {
                this._azureToken = token;
                this._isLoggedInAzure = true;

                this._azureClient = new AzureClient(token);
            }
        });

        // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
        // the panel or when the panel is closed programmatically)
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

        // Set the HTML content for the webview panel
        this._panel.webview.html = this._getWebviewContent(this._panel.webview, extensionUri);

        // Set an event listener to listen for messages passed from the webview context
        this._setWebviewMessageListener(this._panel.webview);
    }

    /**
     * Renders the current webview panel if it exists otherwise a new webview panel
     * will be created and displayed.
     *
     * @param extensionUri The URI of the directory containing the extension.
     */
    public static render(extensionUri: Uri, context: ExtensionContext) {
        if (MainPanel.currentPanel) {
            // If the webview panel already exists reveal it
            MainPanel.currentPanel._panel.reveal(ViewColumn.One);
        } else {
            // If a webview panel does not already exist create and show a new one
            const panel = window.createWebviewPanel(
                // Panel view type
                'showHelloWorld',
                // Panel title
                'feedboard',
                // The editor column the panel should be displayed in
                ViewColumn.One,
                // Extra panel configurations
                {
                    // Enable JavaScript in the webview
                    enableScripts: true,
                    // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
                    localResourceRoots: [
                        Uri.joinPath(extensionUri, 'out'),
                        Uri.joinPath(extensionUri, 'webview-ui/build'),
                    ],
                }
            );

            MainPanel.currentPanel = new MainPanel(panel, extensionUri, context);
        }
    }

    /**
     * Cleans up and disposes of webview resources when the webview panel is closed.
     */
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

    /**
     * Defines and returns the HTML that should be rendered within the webview panel.
     *
     * @remarks This is also the place where references to the React webview build files
     * are created and inserted into the webview HTML.
     *
     * @param webview A reference to the extension webview
     * @param extensionUri The URI of the directory containing the extension
     * @returns A template string literal containing the HTML that should be
     * rendered within the webview panel
     */
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

    /**
     * Sets up an event listener to listen for messages passed from the webview context and
     * executes code based on the message that is recieved.
     *
     * @param webview A reference to the extension webview
     * @param context A reference to the extension context
     */
    // private _setWebviewMessageListener(webview: Webview) {
    //     webview.onDidReceiveMessage((x) => this._commandsHandler(x, webview), undefined, this._disposables);
    // }
    private _setWebviewMessageListener(webview: Webview) {
        webview.onDidReceiveMessage(
            async (message: any) => {
                const payload = message.payload;

                switch (message.command) {
                    case 'startMonitoring':
                        window.showInformationMessage('startMonitoring');

                        // if (this._azureToken !== null) {
                        //     this._eventHubClient = new EventHubClient(
                        //         payload.namespace,
                        //         this._azureToken,
                        //         payload.eventHubName,
                        //         payload.consumerGroup !== undefined ? payload.consumerGroup : '$Default'
                        //     );

                        //     if (!this._isMonitoring) {
                        //         this._eventHubClient.startMonitoring(async (events, _) => {
                        //             webview.postMessage({
                        //                 command: 'setMessages',
                        //                 payload: events[0].body,
                        //             });
                        //         });
                        //     }
                        // }

                        this._eventHubClient = new EventHubClient(
                            `Endpoint=sb://event-hubs-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=SFlC9l5c9Ei0AzjQrEvWmYOkW83FNQJmo+AEhALncUE=`,
                            'event-hub'
                        ); // TODO get connectionString or credential

                        if (!this._isMonitoring) {
                            this._eventHubClient.startMonitoring(async (events, _) => {
                                webview.postMessage({
                                    command: 'setMessages',
                                    payload: events[0].body,
                                });
                            });
                        }

                        break;

                    case 'stopMonitoring':
                        if (this._isMonitoring && this._eventHubClient !== undefined) {
                            await this._eventHubClient.stopMonitoring();
                        }
                        break;

                    case 'getSubscriptions':
                        if (this._azureClient !== undefined) {
                            console.log('getSubscriptions._credential', this._azureClient._credential);

                            webview.postMessage({
                                command: 'setSubscriptions',
                                payload: await this._azureClient.getSubscriptions(),
                            });
                        }
                        break;

                    case 'getResourceGroups':
                        if (this._azureClient !== undefined) {
                            webview.postMessage({
                                command: 'setResourceGroups',
                                payload: await this._azureClient.getResourceGroups(payload.subscriptionId),
                            });
                        }
                        break;

                    case 'getNamespaces':
                        if (this._azureClient !== undefined) {
                            webview.postMessage({
                                command: 'setNamespaces',
                                payload: await this._azureClient.getNamespacesByResourceGroup(
                                    payload.subscriptionId,
                                    payload.resourceGroupName
                                ),
                            });
                        }
                        break;

                    case 'getEventHubs':
                        if (this._azureClient !== undefined) {
                            webview.postMessage({
                                command: 'setEventHubs',
                                payload: await this._azureClient.getEventHubsByNamespace(
                                    payload.subscriptionId,
                                    payload.resourceGroupName,
                                    payload.namespaceName
                                ),
                            });
                        }
                        break;

                    case 'getConsumerGroups':
                        if (this._azureClient !== undefined) {
                            webview.postMessage({
                                command: 'setEventHubs',
                                payload: await this._azureClient.getConsumerGroups(
                                    payload.subscriptionId,
                                    payload.resourceGroupName,
                                    payload.namespaceName,
                                    payload.eventHubName
                                ),
                            });
                        }
                        break;

                    case 'getIsLoggedInAzure':
                        webview.postMessage({
                            command: 'setIsLoggedInAzure',
                            payload: this._isLoggedInAzure,
                        });
                        break;

                    case 'singInWithAzure':
                        const result = await commands.executeCommand<AzureTokenResponse>('feedboard.singInWithAzure');

                        this._azureToken = this._tokenHelper.createAzureToken(
                            result.accessToken,
                            result.accessTokenExpiredAt
                        );

                        console.log('_azureToken', this._azureToken);

                        if (this._azureToken !== null) {
                            this._azureClient = new AzureClient(this._azureToken);

                            webview.postMessage({
                                command: 'setLoggedInAzure',
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
