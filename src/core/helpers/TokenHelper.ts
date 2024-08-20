import { AzureToken, TAzureTokenResponseDto } from '@feedboard/feedboard.core';
import { StoreHelper } from './storeHelper';

export class TokenHelper {
    private static readonly _storeHelper: StoreHelper = StoreHelper.getInstance();
    private static readonly _azureToken: AzureToken = new AzureToken();

    public async createAzureToken(token: TAzureTokenResponseDto): Promise<AzureToken> {
        await TokenHelper._storeHelper.storeValueAsync('azureToken', JSON.stringify(token));

        return TokenHelper._azureToken.addTokenOrUpdate(token);
    }

    public async getAzureToken(): Promise<AzureToken | null> {
        const json = await TokenHelper._storeHelper.getValueAsync('azureToken');

        if (json) {
            return new AzureToken(JSON.parse(json));
        }

        return null;
    }
}
