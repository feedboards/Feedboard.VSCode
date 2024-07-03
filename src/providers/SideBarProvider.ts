import * as vscode from 'vscode';
import { getNonce, getUri } from '../utilities';
import { AzureClient, AzureTokenResponse, EventHubClient, TokenHelper } from '../core';
import {
    TMainPanelPayload,
    EMainSideBarCommands,
    isTMainPanelGetResourceGroups,
    isTMainPanelGetNamespaces,
    isTMainPanelGetEventHubs,
    isTMainPanelGetConsumerGroups,
    isTMainPanelStartMonitoring,
    isTMainPanelStartMonitoringByConnectionString,
    isString,
} from '../helpers';
import { Constnants } from '../constants';

export class SideBarProvider implements vscode.WebviewViewProvider {
    public view?: vscode.WebviewView;

    private readonly _tokenHelper: TokenHelper;
    private _azureClient: AzureClient | undefined;
    private _webview: vscode.Webview | undefined;

    constructor(private readonly _extensionUri: vscode.Uri) {
        this._tokenHelper = new TokenHelper();
        this._tokenHelper.getAzureToken().then((token) => {
            if (token !== null) {
                Constnants.azureToken = token;
                this._azureClient = new AzureClient(token);

                if (this._webview !== undefined) {
                    this._webview.postMessage({
                        command: EMainSideBarCommands.setIsLoggedInAzure,
                        payload: true,
                    });
                }
            }
        });
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext<unknown>,
        token: vscode.CancellationToken
    ): void | Thenable<void> {
        this.view = webviewView;

        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri],
        };

        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

        this._setWebviewMessageListener(webviewView.webview);
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const nonce = getNonce();

        return /*html*/ `
          <!DOCTYPE html>
          <html lang="en" class="main-side-bar__html">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <link rel="stylesheet" type="text/css" href="${getUri(webview, this._extensionUri, [
                  'webview-ui',
                  'build',
                  'assets',
                  'mainSideBar.css',
              ])}">
              <title>feedboard</title>
            </head>
            <body class="main-side-bar__body">
              <div id="root" class="main-side-bar__root"></div>
              <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'assets',
            'mainSideBar.js',
        ])}"></script>
        <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'assets',
            'index.js',
        ])}"></script>
            </body>
          </html>
        `;
    }

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (message: { command: EMainSideBarCommands; payload: any }) => {
            this._webview = webview;

            const payload = message.payload;

            switch (message.command) {
                case EMainSideBarCommands.removeConnection:
                    Constnants.removeConnection(payload);
                    break;

                case EMainSideBarCommands.openConnection:
                    Constnants.openConnections.push(payload);
                    vscode.commands.executeCommand('feedboard.main-view', payload);
                    console.log(Constnants.openConnections);
                    break;

                case EMainSideBarCommands.getIsLoggedInAzure:
                    await webview.postMessage({
                        command: EMainSideBarCommands.setIsLoggedInAzure,
                        payload: Constnants.isLoggedInAzure,
                    });
                    break;

                case EMainSideBarCommands.getSavedConnections:
                    await webview.postMessage({
                        command: EMainSideBarCommands.setSavedConnections,
                        payload: Constnants.connections,
                    });
                    break;

                case EMainSideBarCommands.getSubscriptions:
                    console.log('command getSubscriptions');
                    if (this._azureClient !== undefined) {
                        await webview.postMessage({
                            command: EMainSideBarCommands.setSubscriptions.toString(),
                            payload: await this._azureClient.getSubscriptions(),
                        });
                    }
                    break;

                case EMainSideBarCommands.getResourceGroups:
                    console.log('command getResourceGroups');
                    if (this._azureClient !== undefined && isTMainPanelGetResourceGroups(payload)) {
                        await webview.postMessage({
                            command: EMainSideBarCommands.setResourceGroups,
                            payload: await this._azureClient.getResourceGroups(payload.subscriptionId),
                        });
                    }
                    break;

                case EMainSideBarCommands.getNamespaces:
                    console.log('command getNamespaces');
                    if (this._azureClient !== undefined && isTMainPanelGetNamespaces(payload)) {
                        await webview.postMessage({
                            command: EMainSideBarCommands.setNamespaces,
                            payload: await this._azureClient.getNamespacesByResourceGroup(
                                payload.subscriptionId,
                                payload.resourceGroupName
                            ),
                        });
                    }
                    break;

                case EMainSideBarCommands.getIsLoggedInAzure:
                    await webview.postMessage({
                        command: EMainSideBarCommands.setIsLoggedInAzure,
                        payload: Constnants.isLoggedInAzure,
                    });
                    break;

                case EMainSideBarCommands.singInWithAzure:
                    const result = await vscode.commands.executeCommand<AzureTokenResponse>(
                        'feedboard.singInWithAzure'
                    );

                    console.log('result of sude bar provider by singInWithAzure command', result);

                    Constnants.azureToken = this._tokenHelper.createAzureToken(
                        result.accessToken,
                        result.accessTokenExpiredAt
                    );

                    if (Constnants.azureToken !== null) {
                        console.log('azureToken is not null');
                        this._azureClient = new AzureClient(Constnants.azureToken);

                        Constnants.isLoggedInAzure = true;

                        await webview.postMessage({
                            command: EMainSideBarCommands.setIsLoggedInAzure,
                            payload: Constnants.isLoggedInAzure,
                        });
                    }
                    break;

                case EMainSideBarCommands.addConnection:
                    console.log('EMainSideBarCommands.addConnection', payload);
                    Constnants.addConnection(payload);

                    // await webview.postMessage({
                    //     command: EMainPanelCommands.setConnection,
                    //     payload: payload,
                    // });
                    break;

                case EMainSideBarCommands.updateConnection:
                    Constnants.updateConnection(payload);
                    break;
            }
        });
    }
}
