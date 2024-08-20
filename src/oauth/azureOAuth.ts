import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../htmls';
import { Feedboard, TAzureTokenResponseDto } from '@feedboard/feedboard.core';
import { StoreHelper } from '../helpers';
import { EStoreKeywords } from '../types';

export const authenticateAzure = async (context: StoreHelper): Promise<TAzureTokenResponseDto> => {
    const response = await Feedboard.getAzureLoginURI();

    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(response.data.url));

    return new Promise<TAzureTokenResponseDto>(async (resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            if (req.url) {
                const queryObject = url.parse(req.url, true).query;

                if (queryObject.code && queryObject.state) {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    res.writeHead(200, { 'Content-Type': 'text/html' });

                    const code = queryObject.code as string;
                    const state = queryObject.state as string;

                    try {
                        const response = await Feedboard.getAzureToken(code, state);

                        await context.storeValueAsync(EStoreKeywords.azureToken, JSON.stringify(response.data));

                        // TODO make redirect to our web site
                        // res.writeHead(302, { 'Location': 'http://example.com/success' });  // Update the URL as needed
                        // res.end();

                        res.end(html.successHTML);

                        vscode.window.showInformationMessage('Authentication successful!');
                    } catch (error: any) {
                        res.end(html.errorHTML);

                        vscode.window.showErrorMessage(
                            `Authentication failed!. Error during Azure authentication: ${error.message}`
                        );

                        reject(error);

                        return;
                    }

                    server.close(async () => {
                        console.log('server stopped');

                        const json: string | undefined = await context.getValueAsync(EStoreKeywords.azureToken);

                        resolve(json ? JSON.parse(json) : json);
                    });
                }
            }
        });

        // TODO get port from settings
        server.listen(17988, () => {
            console.log('Listening on port 17988...');
        });
    });
};
