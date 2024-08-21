import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { MainPanel } from './panels';
import { authenticateGitHub, authenticateAzure } from './oauth';
import { ContextManager } from './managers';
import {
    Feedboard,
    TConnection,
    TGithubTokenResponseDto,
    GithubToken,
    AzureToken,
    TAzureTokenResponseDto,
} from '@feedboard/feedboard.core';
import { StoreHelper } from './helpers';
import { ConnectionHelper } from './helpers/connectionHelper';

export const activate = async (context: vscode.ExtensionContext) => {
    StoreHelper.initialize(context);
    Feedboard.init(''); // TODO add baseURL

    const storeHelper = StoreHelper.instance;

    console.log('storeHelper', storeHelper);

    const githubToken = new GithubToken();
    const azureToken = new AzureToken();

    ContextManager.initialize(context);
    ContextManager.getInstance().setContext(context);
    await ConnectionHelper.init();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('feedboard-sidebar-view', new SideBarProvider(context.extensionUri))
    );

    registerCommand('main-view', (connection: TConnection) => {
        MainPanel.render(context.extensionUri, context, connection);
    });

    registerCommand('singInWithGitHub', async (): Promise<TGithubTokenResponseDto> => {
        const result: TGithubTokenResponseDto = await authenticateGitHub(storeHelper);

        if (!result) {
            // TODO show error

            throw new Error("couldn't authorize into Github account");
        }

        githubToken.addTokenOrUpdate(result);

        return result;
    });

    registerCommand('singInWithAzure', async (): Promise<TAzureTokenResponseDto> => {
        const result: TAzureTokenResponseDto = await authenticateAzure(storeHelper);

        if (!result) {
            // TODO show error

            throw new Error("couldn't authorize into Azure account");
        }

        azureToken.addTokenOrUpdate(result);

        return result;
    });

    function registerCommand(command: string, callback: (...arg: any[]) => any) {
        context.subscriptions.push(vscode.commands.registerCommand(`feedboard.${command}`, callback));
    }
};

export const deactivate = async () => {
    await ConnectionHelper.saveCurrentConnectionIntoStorage();
};
