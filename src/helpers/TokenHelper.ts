import { AzureToken, GithubToken, TAzureTokenResponseDto, TGithubTokenResponseDto } from '@feedboard/feedboard.core';
import { StoreHelper } from './storeHelper';
import { EStoreKeywords } from '../types';

export class TokenHelper {
    private readonly _storeHelper: StoreHelper = StoreHelper.instance;
    private static readonly _azureToken: AzureToken = new AzureToken();
    private static readonly _githubToken: GithubToken = new GithubToken();

    public async createAzureToken(token: TAzureTokenResponseDto): Promise<AzureToken> {
        await this._storeHelper.storeValueAsync(EStoreKeywords.azureToken, JSON.stringify(token));

        return TokenHelper._azureToken.addTokenOrUpdate(token);
    }

    public async getAzureToken(): Promise<AzureToken | null> {
        const json: string | undefined = await this._storeHelper.getValueAsync(EStoreKeywords.azureToken);

        if (json) {
            return new AzureToken(JSON.parse(json));
        }

        return null;
    }

    public async createGithubToken(token: TGithubTokenResponseDto): Promise<GithubToken> {
        await this._storeHelper.storeValueAsync(EStoreKeywords.githubToken, JSON.stringify(token));

        return TokenHelper._githubToken.addTokenOrUpdate(token);
    }

    public async getGithubToken(): Promise<GithubToken | null> {
        const json: string | undefined = await this._storeHelper.getValueAsync(EStoreKeywords.githubToken);

        if (json) {
            return new GithubToken(JSON.parse(json));
        }

        return null;
    }
}
