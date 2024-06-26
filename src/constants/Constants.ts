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
            name: 'test',
            settings: {
                loginType: ELoginType.connectionString,
                connectionString: 'connectionString',
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
