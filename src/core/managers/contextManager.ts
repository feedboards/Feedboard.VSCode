import * as vscode from 'vscode';

export class ContextManager {
    private static instance: ContextManager;
    private context: vscode.ExtensionContext | null = null;

    // Private constructor to ensure singleton behavior
    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public static initialize(context: vscode.ExtensionContext) {
        if (!ContextManager.instance) {
            ContextManager.instance = new ContextManager(context);
        }
    }

    public static getInstance(): ContextManager {
        if (!ContextManager.instance) {
            throw new Error('ContextManager is not initialized yet.');
        }
        return ContextManager.instance;
    }

    public getContext(): vscode.ExtensionContext {
        if (!this.context) {
            throw new Error("Context has not been set");
        }
        return this.context;
    }

    public setContext(context: vscode.ExtensionContext): ContextManager {
        this.context = context;
        return this;
    }
}