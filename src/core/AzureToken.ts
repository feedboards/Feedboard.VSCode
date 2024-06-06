import { AccessToken, GetTokenOptions, TokenCredential } from '@azure/identity';

export class AzureToken implements TokenCredential {
    private readonly _accessToken: string;
    private readonly _expiresOnTimestamp: number;

    constructor(accessToken: string, expiredAt: string) {
        this._accessToken = accessToken;
        this._expiresOnTimestamp = new Date(expiredAt).getTime();
    }

    public async getToken(
        scopes: string | string[],
        options?: GetTokenOptions | undefined
    ): Promise<AccessToken | null> {
        return {
            token: this._accessToken,
            expiresOnTimestamp: this._expiresOnTimestamp,
        };
    }
}
