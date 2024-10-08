import { ELoginType, TConnection } from '@feedboard/feedboard.core';
import { StoreHelper } from './storeHelper';
import { EStoreKeywords } from '../types';

// TODO delete this hardcode
const connections: TConnection[] = [
    // TODO fix it
    {
        id: 'asd',
        name: 'connection string',
        settings: {
            loginType: ELoginType.connectionString,
            connectionString:
                'Endpoint=sb://feedboard-test-namespace.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=OvF2Hq7GdWTmpU1neaIA4HtAJ3B552l30+AEhI+CxhI=',
        },
    },
    {
        id: '4b9ef858-e028-4f88-bc78-a99532a20c64',
        name: 'OAuth',
        settings: {
            loginType: ELoginType.azureOAuth,
            namespace: {
                id: '/subscriptions/a9f2fbe2-dc78-4f70-9d5a-48aa091e38c9/resourceGroups/feedboard-test/providers/Microsoft.EventHub/namespaces/feedboard-test-namespace',
                name: 'feedboard-test-namespace',
            },
            resourceGroup: {
                id: '/subscriptions/a9f2fbe2-dc78-4f70-9d5a-48aa091e38c9/resourceGroups/feedboard-test',
                name: 'feedboard-test',
            },
            subscription: {
                displayName: 'Azure subscription 1',
                subscriptionId: 'a9f2fbe2-dc78-4f70-9d5a-48aa091e38c9',
            },

            // TODO fix
            eventHub: {
                id: '',
                name: '',
            },
            consumerGroup: {
                id: '',
                name: '',
            },
        },
    },
    {
        id: 'asdasss',
        name: 'MQTT',
        settings: {
            loginType: ELoginType.mqtt,
            host: 'mqtt://localhost',
        },
    },
];

export class ConnectionHelper {
    private static _connections: TConnection[] = [];
    private static _openConnections: TConnection[] = [];
    private static _storeHelper: StoreHelper;

    public static async init(): Promise<void> {
        this._storeHelper = StoreHelper.instance;

        // const json: string | undefined = await this._storeHelper.getValueAsync(EStoreKeywords.connections);

        // if (!json) {
        //     return;
        // }

        // this._connections = JSON.parse(json);

        this._connections = connections;
    }

    public static get connections(): TConnection[] {
        return this._connections;
    }

    public static get openConnections(): TConnection[] {
        return this._openConnections;
    }

    public static addOpenConnection(connection: TConnection): void {
        this._openConnections.push(connection);
    }

    public static addConnection(connection: TConnection): void {
        this._connections.push(connection);
    }

    public static updateConnection(connection: TConnection) {
        const index: number | undefined = this._connections.findIndex((x) => x.id === connection.id);

        if (index !== undefined && index > -1) {
            this._connections[index] = connection;
        }
    }

    public static removeConnection(connection: TConnection) {
        const index: number | undefined = this._connections.findIndex((x) => x.id === connection.id);

        if (index !== undefined && index > -1) {
            this._connections = this._connections.filter((x) => x.id !== connection.id);
        }
    }

    public static async saveCurrentConnectionIntoStorage(): Promise<void> {
        if (this._connections.length <= 0) {
            return;
        }

        await this._storeHelper.storeValueAsync(EStoreKeywords.connections, JSON.stringify(this._connections));
    }
}
