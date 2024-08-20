import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../htmls';
import { Feedboard, TGithubTokenResponseDto } from '@feedboard/feedboard.core';
import { StoreHelper } from '../helpers';

export const authenticateGitHub = async (context: StoreHelper): Promise<TGithubTokenResponseDto> => {
    const response = await Feedboard.getGitHubLoginURI();

    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(response.data.url));

    return new Promise<TGithubTokenResponseDto>(async (resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            if (req.url) {
                const queryObject = url.parse(req.url, true).query;

                if (queryObject.code) {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    res.writeHead(200, { 'Content-Type': 'text/html' });

                    const code = queryObject.code as string;

                    try {
                        const response = await Feedboard.getGitHubAccessToken(code);

                        await context.storeValueAsync('githubAccessToken', response.data.accessToken);
                        await context.storeValueAsync('githubUserId', response.data.userId);

                        res.end(html.successHTML);

                        vscode.window.showInformationMessage('Authentication successful!');
                    } catch (error: any) {
                        res.end(html.errorHTML);

                        vscode.window.showErrorMessage(
                            `Authentication failed!. Error during GitHub authentication: ${error.message}`
                        );

                        reject(error);

                        return;
                    }

                    server.close(async () => {
                        console.log('server stoping');

                        resolve({
                            accessToken: (await context.getValueAsync('githubAccessToken')) as string,
                            userId: (await context.getValueAsync('githubUserId')) as string,
                        });
                    });
                }
            }
        });

        // TODO get port from settings
        server.listen(17989, () => {
            console.log('Listening on port 17989...');
        });
    });
};
