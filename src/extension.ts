import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { MainPanel } from './panels';

export function activate(context: vscode.ExtensionContext) {
    vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right).show();

    context.subscriptions.push(
        vscode.window.registerWebviewViewProvider(
            'feedboard-sidebar-view',
            new SideBarProvider(context.extensionUri)
        )
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.main-view', () => {
            MainPanel.render(context.extensionUri);
        })
    );
}
