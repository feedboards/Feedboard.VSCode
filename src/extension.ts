import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { MainPanel } from './panels';
import {
    AzureToken,
    StoreHelper,
    AzureTokenResponse,
    GithubTokenResponse,
    authenticateGitHub,
    authenticateAzure,
} from './core';
import { useIdentityPlugin } from '@azure/identity';

// Azure
export let azureAccessToken: string = '';
export let azureIdToken: string = '';
export let azureRefreshToken: string = '';
export let azureAccessTokenExpiredAt: string = '';

// GitHub
export let githubAccessToken: string = '';
export let githubUserId: string = '';

export async function activate(context: vscode.ExtensionContext) {
    // use this helper if you want to get any secrets
    const storeHelper = new StoreHelper(context);

    await configData(storeHelper);

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('feedboard-sidebar-view', new SideBarProvider(context.extensionUri))
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.main-view', () => {
            MainPanel.render(context.extensionUri, context);
        })
    );

    // commands
    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.singInWithGitHub', async () => {
            const result: GithubTokenResponse = await authenticateGitHub(storeHelper);

            // test
            console.log('github result', result);

            githubAccessToken = result.accessToken;
            githubUserId = result.userId;
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
            azureAccessToken = result.accessToken;
            azureAccessTokenExpiredAt = result.accessTokenExpiredAt;
            azureIdToken = result.idToken;
            azureRefreshToken = result.refreshToken;
            // }

            return result;
        })
    );
}

const configData = async (storeHelper: StoreHelper) => {
    const keysToVariables = {
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
