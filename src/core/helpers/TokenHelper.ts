import { AzureToken } from '../oauth';
import { StoreHelper } from './storeHelper';

export class TokenHelper {
    private readonly storeHelper: StoreHelper = StoreHelper.getInstance();

    public createAzureToken(accessToken: string, expiredAt: string): AzureToken {
        return new AzureToken(accessToken, expiredAt);
    }

    public async getAzureToken(): Promise<AzureToken | null> {
        const accessToken = await this.storeHelper.getValueAsync('azureAccessToken');
        const expiredAt = await this.storeHelper.getValueAsync('azureAccessTokenExpiredAt');

        if (accessToken !== undefined && expiredAt !== undefined) {
            return new AzureToken(accessToken, expiredAt);
        } else {
            return null;
        }
    }
}
