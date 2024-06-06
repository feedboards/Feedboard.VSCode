import * as vscode from 'vscode';

export class StoreHelper {
    private context: vscode.ExtensionContext;

    constructor(context: vscode.ExtensionContext) {
        this.context = context;
    }

    public async getValueAsunc(value: string): Promise<string | undefined> {
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