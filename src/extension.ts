import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { Panel } from './panels';
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
import { StoreHelper, ConnectionHelper } from './helpers';

export const activate = async (context: vscode.ExtensionContext) => {
    Feedboard.init('http://localhost/api'); // TODO add baseURL
    StoreHelper.initialize(context);

    const storeHelper = StoreHelper.instance;
    const githubToken = new GithubToken();
    const azureToken = new AzureToken();

    ContextManager.initialize(context);
    ContextManager.getInstance().setContext(context);
    await ConnectionHelper.init();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider('feedboard-sidebar-view', new SideBarProvider(context.extensionUri))
    );

    registerCommand('main-view', (connection: TConnection) => {
        Panel.render(context.extensionUri, connection);
    });

    registerCommand('singInWithGitHub', async (): Promise<TGithubTokenResponseDto> => {
        const result: TGithubTokenResponseDto = await authenticateGitHub(storeHelper);

        if (!result) {
            vscode.window.showErrorMessage("couldn't authorize into Github account");

            throw new Error("couldn't authorize into Github account");
        }

        githubToken.addTokenOrUpdate(result);

        return result;
    });

    registerCommand('singInWithAzure', async (): Promise<TAzureTokenResponseDto> => {
        const result: TAzureTokenResponseDto = await authenticateAzure(storeHelper);

        if (!result) {
            vscode.window.showErrorMessage("couldn't authorize into Azure account");

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
