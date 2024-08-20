import { TConnection, ELoginType } from '@feedboard/feedboard.core';

export class Constants {
    public static connections: TConnection[] = [
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
            },
        }, // test data
    ];

    public static openConnections: TConnection[] = [];

    public static removeConnection(connection: TConnection) {
        const index: number | undefined = this.openConnections.indexOf(connection);

        if (index !== undefined && index > -1) {
            this.openConnections.slice(index, 1); // TODO update connections in Storage
        }
    }

    public static addConnection(connection: TConnection) {
        this.connections.push(connection); // TODO add connection to Storage
    }

    public static updateConnection(connection: TConnection) {
        const index: number | undefined = this.connections.indexOf(connection);

        if (index !== undefined && index > -1) {
            this.connections[index] = connection;
        }
    }

    public static init() {
        console.log('init'); //TODO get connections from Storage
    }
}
