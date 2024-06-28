import { TokenCredential } from '@azure/identity';
import { ELoginType, TConnection } from '../helpers';

export class Constnants {
    public static azureAccessToken: string = '';
    public static azureIdToken: string = '';
    public static azureRefreshToken: string = '';
    public static azureAccessTokenExpiredAt: string = '';

    public static isLoggedInAzure: boolean = false;
    public static azureToken: TokenCredential | null = null;

    public static githubAccessToken: string = '';
    public static githubUserId: string = '';

    public static isMonitoring: boolean = false;

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
                loginType: ELoginType.oAuth,
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
        },
    ];

    public static openConnections: TConnection[] = [];

    public static closeOpenConnection(connection: TConnection) {
        const index = this.openConnections.indexOf(connection);

        if (index !== undefined && index > -1) {
            this.openConnections.slice(index, 1);
        }
    }

    public static addConnection(connection: TConnection) {
        Constnants.connections.push(connection); // TODO add connection to Storage
    }

    public static init() {
        console.log('init'); //TODO get connections from Storage
    }
}
