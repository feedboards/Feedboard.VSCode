import * as vscode from 'vscode';
import { getNonce, getUri } from '../utilities';

export class SideBarProvider implements vscode.WebviewViewProvider {
    public view?: vscode.WebviewView;

    constructor(private readonly _extensionUri: vscode.Uri) {}

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
    }

    private _getHtmlForWebview(webview: vscode.Webview) {
        const nonce = getNonce();

        // <link rel="stylesheet" type="text/css" href="${getUri(webview, this._extensionUri, ['webview-ui', 'build', 'assets', 'jsx-runtime.css'])}">

        return /*html*/ `
          <!DOCTYPE html>
          <html lang="en">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <meta http-equiv="Content-Security-Policy" style-src 'self' 'unsafe-inline';">
              <title>feedboard</title>
            </head>
            <body>
              <div id="root"></div>
              <script type="module" nonce="${nonce}" src="${getUri(webview, this._extensionUri, [
            'webview-ui',
            'build',
            'assets',
            'mainSideBar.js',
        ])}"></script>
            </body>
          </html>
        `;
    }
}
