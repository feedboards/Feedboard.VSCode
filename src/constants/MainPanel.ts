import { TokenCredential } from '@azure/identity';

export class MainPanelConstants {
    public static isLoggedInAzure: boolean = false;
    public static isMonitoring: boolean = false;
    public static azureToken: TokenCredential | null = null;
}
