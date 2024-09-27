import * as vscode from 'vscode';
import { getNonce, getUri } from '../utilities';
import { ESideBarCommands } from '../../common/commands';
import { isTMainPanelGetNamespaces, isTMainPanelGetResourceGroups } from '../../common/types';
import { AzureClient, AzureToken, Feedboard, TAzureTokenResponseDto } from '@feedboard/feedboard.core';
import { TokenHelper, ConnectionHelper } from '../helpers';

export class SideBarProvider implements vscode.WebviewViewProvider {
    public view?: vscode.WebviewView;

    private readonly _tokenHelper: TokenHelper;

    private _token: AzureToken;
    private _azureClient: AzureClient | undefined;
    private _webview: vscode.Webview | undefined;

    constructor(private readonly _extensionUri: vscode.Uri) {
        this._token = new AzureToken();
        this._tokenHelper = new TokenHelper();

        this._tokenHelper.getAzureToken().then((token) => {
            if (!token) {
                return;
            }

            this._azureClient = new AzureClient(token);
            this._token.addTokenOrUpdate(token.getActiveTokenAsResponseDto());

            if (this._webview) {
                this._webview.postMessage({
                    command: ESideBarCommands.setIsLoggedInAzure,
                    payload: this._token.isLogged(),
                });
            }
        });
    }

    public resolveWebviewView(
        webviewView: vscode.WebviewView,
        context: vscode.WebviewViewResolveContext,
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
                  'sideBar.css',
              ])}">
              <title>feedboard</title>
            </head>
            <body class="main-side-bar__body">
                <div id="root" class="main-side-bar__root"></div>
                <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'sideBar.js',
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

    private _setWebviewMessageListener(webview: vscode.Webview) {
        webview.onDidReceiveMessage(async (message: { command: ESideBarCommands; payload: any }) => {
            this._webview = webview;

            const payload = message.payload;

            switch (message.command) {
                case ESideBarCommands.updateBaseAPIUrl:
                    // update baseAPIUrl in Feedboard client
                    break;

                case ESideBarCommands.getBaseAPIUrl:
                    await webview.postMessage({
                        command: ESideBarCommands.setBaseAPIUrl,
                        payload: '', // get base URl from Feedboard client
                    });
                    break;

                case ESideBarCommands.openConnection:
                    ConnectionHelper.addOpenConnection(payload);

                    vscode.commands.executeCommand('feedboard.main-view', payload);
                    break;

                case ESideBarCommands.getIsLoggedInAzure:
                    await webview.postMessage({
                        command: ESideBarCommands.setIsLoggedInAzure,
                        payload: this._token.isLogged(),
                    });
                    break;

                case ESideBarCommands.getSavedConnections:
                    await webview.postMessage({
                        command: ESideBarCommands.setSavedConnections,
                        payload: ConnectionHelper.connections,
                    });
                    break;

                case ESideBarCommands.getSubscriptions:
                    console.log('command getSubscriptions');
                    if (this._azureClient !== undefined) {
                        await webview.postMessage({
                            command: ESideBarCommands.setSubscriptions.toString(),
                            payload: await this._azureClient.getSubscriptions(),
                        });
                    }
                    break;

                case ESideBarCommands.getResourceGroups:
                    console.log('command getResourceGroups');
                    if (this._azureClient !== undefined && isTMainPanelGetResourceGroups(payload)) {
                        await webview.postMessage({
                            command: ESideBarCommands.setResourceGroups,
                            payload: await this._azureClient.getResourceGroups(payload.subscriptionId),
                        });
                    }
                    break;

                case ESideBarCommands.getNamespaces:
                    console.log('command getNamespaces');
                    if (this._azureClient !== undefined && isTMainPanelGetNamespaces(payload)) {
                        await webview.postMessage({
                            command: ESideBarCommands.setNamespaces,
                            payload: await this._azureClient.getNamespacesByResourceGroup(
                                payload.subscriptionId,
                                payload.resourceGroupName
                            ),
                        });
                    }
                    break;

                case ESideBarCommands.singInWithAzure:
                    const result = await vscode.commands.executeCommand<TAzureTokenResponseDto>(
                        'feedboard.singInWithAzure'
                    );

                    try {
                        this._token.addTokenOrUpdate(result);
                        this._azureClient = new AzureClient(this._token);
                        await this._tokenHelper.createAzureToken(result);

                        await webview.postMessage({
                            command: ESideBarCommands.setIsLoggedInAzure,
                            payload: this._token.isLogged(),
                        });
                    } catch (error) {
                        // TODO implemtnt catch
                    }
                    break;

                case ESideBarCommands.addConnection:
                    console.log('EMainSideBarCommands.addConnection', payload);

                    ConnectionHelper.addConnection(payload);

                    // await webview.postMessage({
                    //     command: EMainPanelCommands.setConnection,
                    //     payload: payload,
                    // });
                    break;

                case ESideBarCommands.removeConnection:
                    ConnectionHelper.removeConnection(payload);
                    break;

                case ESideBarCommands.updateConnection:
                    ConnectionHelper.updateConnection(payload);
                    break;
            }
        });
    }
}
