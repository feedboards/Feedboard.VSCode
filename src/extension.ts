import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { MainPanel } from './panels';
import { StoreHelper, AzureTokenResponse, GithubTokenResponse, authenticateGitHub, authenticateAzure } from './core';
import { Constants } from './constants';
import { ContextManager } from './core/managers/contextManager';
import { TConnection } from '../common/types';

export async function activate(context: vscode.ExtensionContext) {
    // use this helper if you want to get any secrets
    StoreHelper.initialize(context);

    // Usage elsewhere in the code
    const storeHelper = StoreHelper.getInstance();

    // initializing ContextManager
    ContextManager.initialize(context);

    // if you need to get context you ContextManager.getInstance().getContext();
    ContextManager.getInstance().setContext(context);

    await configData(storeHelper);
    Constants.init();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('feedboard-sidebar-view', new SideBarProvider(context.extensionUri))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.main-view', (connection: TConnection) => {
            MainPanel.render(context.extensionUri, context, connection);
        })
    );

    // commands
    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.singInWithGitHub', async () => {
            const result: GithubTokenResponse = await authenticateGitHub(storeHelper);

            // test
            console.log('github result', result);

            Constants.githubAccessToken = result.accessToken;
            Constants.githubUserId = result.userId;
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.singInWithAzure', async () => {
            const result: AzureTokenResponse = await authenticateAzure(storeHelper);

            // if (result.accessToken !== undefined &&
            //     result.accessTokenExpiredAt !== undefined &&
            //     result.idToken !== undefined &&
            //     result.refreshToken !== undefined
            // ) {
            Constants.azureAccessToken = result.accessToken;
            Constants.azureAccessTokenExpiredAt = result.accessTokenExpiredAt;
            Constants.azureIdToken = result.idToken;
            Constants.azureRefreshToken = result.refreshToken;
            // }

            return result;
        })
    );

    const registerCommand = (command: string, callback: (...arg: any[]) => any) => {

    };
}

const configData = async (storeHelper: StoreHelper) => {
    const keysToVariables: Object = {
        azureAccessToken: 'azureAccessToken',
        azureIdToken: 'azureIdToken',
        azureRefreshToken: 'azureRefreshToken',
        azureAccessTokenExpiredAt: 'azureAccessTokenExpiredAt',
    };

    for (const [key, variableName] of Object.entries(keysToVariables)) {
        const value = await storeHelper.getValueAsync(key);
        if (value !== undefined) {
            exports[variableName] = value;
        }
    }
};
