import * as vscode from 'vscode';

export class StoreHelper {
    private static instance: StoreHelper;
    private context: vscode.ExtensionContext;

    // Private constructor to ensure singleton behavior
    private constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public static initialize(context: vscode.ExtensionContext) {
        if (!StoreHelper.instance) {
            StoreHelper.instance = new StoreHelper(context);
        }
    }

    public static getInstance(): StoreHelper {
        if (!StoreHelper.instance) {
            throw new Error('StoreHelper is not initialized yet.');
        }
        return StoreHelper.instance;
    }

    public async getValueAsync(value: string): Promise<string | undefined> {
        return await this.context.secrets.get(value);
    }

    public async storeValueAsync(key: string, value: string): Promise<boolean> {
        try {
            await this.context.secrets.store(key, value);
            return true;
        } catch (error) {
            return false;
        }
    }

    public async deleteAsync(key: string): Promise<boolean> {
        try {
            this.context.secrets.delete(key);
            return true;
        } catch (error) {
            return false;
        }
    }
}