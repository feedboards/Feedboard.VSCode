import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../html';
import * as constants from '../constants/APIRouts';
import axios from 'axios';
import { StoreHelper } from '../core/storeHelper';
import { GithubTokenResponse } from '../core/types';

export const authenticateGitHub = async (context: StoreHelper): Promise<GithubTokenResponse> => {
    //TODO need to add client
    const response = await axios.get(`${constants.baseAPIURI}GitHubOauth/login`);

    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(response.data.url));

    const server = http.createServer(async (req, res) => {
        if (req.url) {
            const queryObject = url.parse(req.url, true).query;
            if (queryObject.code) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                res.writeHead(200, { 'Content-Type': 'text/html' });

                const code = queryObject.code as string;

                try {
                    //TODO also need to add client
                    const response = await axios.get(`${constants.baseAPIURI}GitHubOauth/callback?code=${code}`);

                    await context.storeValueAsync('githubAccessToken', response.data.accessToken);
                    await context.storeValueAsync('githubUserId', response.data.userId);

                    res.end(html.successHTML);

                    vscode.window.showInformationMessage('Authentication successful!');
                } catch (error: any) {
                    res.end(html.errorHTML);

                    vscode.window.showErrorMessage(
                        `Authentication failed!. Error during GitHub authentication: ${error.message}`
                    );
                }

                server.close(() => {
                    console.log('server stoping');
                });
            }
        }
    });

    server.listen(17989, () => {
        console.log('Listening on port 17989...');
    });

    return {
        accessToken: await context.getValueAsunc('githubAccessToken'),
        userId: await context.getValueAsunc('githubUserId'),
    } as GithubTokenResponse;
};
