import { InteractiveBrowserCredential, TokenCredential } from '@azure/identity';

export class AzureAuth {
    private credential: TokenCredential;

    constructor(clientId: string, tenantId: string, redirectUri: string) {
        this.credential = new InteractiveBrowserCredential({
            clientId,
            tenantId,
            redirectUri,
        });
    }

    public async getToken(scopes: string | string[]): Promise<string | undefined> {
        try {
            const accessToken = await this.credential.getToken(scopes);
            return accessToken?.token;
        } catch (error) {
            console.error('Authentication failed', error);
        }
    }
}
