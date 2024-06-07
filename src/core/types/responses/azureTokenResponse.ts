export type AzureTokenResponse = {
    accessToken: string | undefined;
    idToken: string | undefined;
    refreshToken: string | undefined;
    accessTokenExpiredAt: string | undefined;
};