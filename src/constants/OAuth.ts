import { TokenCredential } from '@azure/identity';

export class OAuthConstants {
    public static azureAccessToken: string = '';
    public static azureIdToken: string = '';
    public static azureRefreshToken: string = '';
    public static azureAccessTokenExpiredAt: string = '';

    public static githubAccessToken: string = '';
    public static githubUserId: string = '';

    public static azureToken: TokenCredential | null = null;
}
