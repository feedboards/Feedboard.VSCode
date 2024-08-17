export type GithubTokenResponse = {
    userId: string;
    accessToken: string;
};

export type AzureTokenResponse = {
    accessToken: string;
    idToken: string;
    refreshToken: string;
    accessTokenExpiredAt: string;
};
