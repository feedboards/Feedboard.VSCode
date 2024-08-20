import { ExtensionContext } from 'vscode';

/*
 * use this helper if you want to get any secrets
 */
export class StoreHelper {
    private static instance: StoreHelper;
    private context: ExtensionContext;

    /*
     * Private constructor to ensure singleton behavior
     */
    private constructor(context: ExtensionContext) {
        this.context = context;
    }
    public static initialize(context: ExtensionContext) {
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

    public getValueAsync(value: string): Thenable<string | undefined> {
        return this.context.secrets.get(value);
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
