import { APICore } from "../../apiCore";

const client = new APICore();

export const getGitHubLoginURI = () => {
    return client.get('GitHubOauth/login', null);
};

export const getGitHubAccessToken = (code: string) => {
    return client.get('GitHubOauth/callback', { code });
};