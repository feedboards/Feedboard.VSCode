import { ExtensionContext } from 'vscode';
import { EStoreKeywords } from '../types';

/*
 * use this helper if you want to get any secrets
 */
export class StoreHelper {
    private static _instance: StoreHelper;
    private _context: ExtensionContext;

    /*
     * Private constructor to ensure singleton behavior
     */
    private constructor(context: ExtensionContext) {
        this._context = context;
    }

    public static initialize(context: ExtensionContext) {
        if (!StoreHelper._instance) {
            StoreHelper._instance = new StoreHelper(context);
            console.log('init StoreHelper');
        }
    }

    public static get instance(): StoreHelper {
        if (!StoreHelper._instance) {
            throw new Error('StoreHelper is not initialized yet.');
        }

        return StoreHelper._instance;
    }

    public getValueAsync(key: EStoreKeywords): Thenable<string | undefined> {
        return this._context.secrets.get(key);
    }

    public async storeValueAsync(key: EStoreKeywords, value: string): Promise<boolean> {
        try {
            await this._context.secrets.store(key, value);

            return true;
        } catch (error) {
            return false;
        }
    }

    public async deleteAsync(key: string): Promise<boolean> {
        try {
            this._context.secrets.delete(key);
            return true;
        } catch (error) {
            return false;
        }
    }
}
