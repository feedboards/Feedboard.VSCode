import { ExtensionContext } from 'vscode';

export class ContextManager {
    private static instance: ContextManager;
    private context: ExtensionContext | null = null;

    /*
     * Private constructor to ensure singleton behavior
     */
    private constructor(context: ExtensionContext) {
        this.context = context;
    }

    /*
     * initializing ContextManager
     */
    public static initialize(context: ExtensionContext) {
        if (!ContextManager.instance) {
            ContextManager.instance = new ContextManager(context);
        }
    }

    public static getInstance(): ContextManager {
        if (!ContextManager.instance) {
            throw new Error("ContextManager hasn't initialized yet.");
        }
        return ContextManager.instance;
    }

    public getContext(): ExtensionContext {
        if (!this.context) {
            throw new Error("Context has not been set");
        }
        return this.context;
    }

    /*
     * if you need to get context use ContextManager.getInstance().getContext();
     */
    public setContext(context: ExtensionContext): ContextManager {
        this.context = context;
        return this;
    }
}