import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../../html';
import { StoreHelper } from '../storeHelper';
import { AzureTokenResponse } from '../types';
import { getAzureLoginURI, getAzureTokens } from '../clients';

export const authenticateAzure = async (context: StoreHelper): Promise<AzureTokenResponse> => {
    const response = await getAzureLoginURI();

    console.log(response);

    vscode.commands.executeCommand('vscode.open', vscode.Uri.parse(response.data.url));

    return new Promise<AzureTokenResponse>(async (resolve, reject) => {
        const server = http.createServer(async (req, res) => {
            if (req.url) {
                const queryObject = url.parse(req.url, true).query;
                if (queryObject.code && queryObject.state) {
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    const code = queryObject.code as string;
                    const state = queryObject.state as string;

                    try {
                        const response = await getAzureTokens(code, state);

                        await context.storeValueAsync('azureAccessToken', response.data.accessToken);
                        await context.storeValueAsync('azureIdToken', response.data.idToken);
                        await context.storeValueAsync('azureRefreshToken', response.data.refreshToken);
                        await context.storeValueAsync('azureaccessTokenExpiredAt', response.data.accessTokenExpiredAt);

                        res.end(html.successHTML);

                        vscode.window.showInformationMessage('Authentication successful!');
                    } catch (error: any) {
                        res.end(html.errorHTML);
                        vscode.window.showErrorMessage(`Authentication failed!. Error during Azure authentication: ${error.message}`);
                        reject(error);
                        return;
                    }

                    server.close(async () => {
                        console.log('server stopped');
                        resolve({
                            accessToken: await context.getValueAsync('azureAccessToken') as string,
                            accessTokenExpiredAt: await context.getValueAsync('azureaccessTokenExpiredAt') as string,
                            refreshToken: await context.getValueAsync('azureRefreshToken') as string,
                            idToken: await context.getValueAsync('azureIdToken') as string,
                        });
                    });
                }
            }
        });

        server.listen(17988, () => {
            console.log('Listening on port 17988...');
        });
    });
};
