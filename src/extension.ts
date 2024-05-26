import * as vscode from 'vscode';
import { SideBarProvider } from './providers';
import { MainPanel } from './panels';

export function activate(context: vscode.ExtensionContext) {
    const sideBarProvider = new SideBarProvider(context.extensionUri);

    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);
    item.show();

    context.subscriptions.push(vscode.window.registerWebviewViewProvider('feedboard-main-view', sideBarProvider));
    context.subscriptions.push(
        vscode.commands.registerCommand('feedboard.main-view', () => {
            MainPanel.render(context.extensionUri);
        })
    );
}
