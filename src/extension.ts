import * as vscode from 'vscode';
import { SideBarProvider } from './providers';

export function activate(context: vscode.ExtensionContext) {
    const sideBarProvider = new SideBarProvider(context.extensionUri);

    const item = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right);

    item.show();

    context.subscriptions.push(vscode.window.registerWebviewViewProvider('feedboard-sidebar-view', sideBarProvider));
}
