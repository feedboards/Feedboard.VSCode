import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../html';
import * as constants from '../constants/APIRouts';
import axios from 'axios';
import { StoreHelper } from '../core/secrets/storeHelper';
import { AzureTokenResponse } from '../core/types';

export const authenticateAzure = async (context: StoreHelper): Promise<AzureTokenResponse> => {
    //TODO need to add client
    const response = await axios.get(`${constants.baseAPIURI}AzureOAuth/login-url`);

    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(response.data.url)
    );

    const server = http.createServer(async (req, res) => {
        if (req.url) {
            const queryObject = url.parse(req.url, true).query;
            if (queryObject.code && queryObject.state) {
                // eslint-disable-next-line @typescript-eslint/naming-convention
                res.writeHead(200, { 'Content-Type': 'text/html' });

                const code = queryObject.code as string;
                const state = queryObject.state as string;

                try {
                    //TODO also need to add client
                    const response = await axios.get(`${constants.baseAPIURI}AzureOAuth/process-code?code=${code}&state=${state}`);

                    await context.storeValueAsync('azureAccessToken', response.data.accessToken);
                    await context.storeValueAsync('azureIdToken', response.data.idToken);
                    await context.storeValueAsync('azureRefreshToken', response.data.refreshToken);
                    await context.storeValueAsync('azureaccessTokenExpiredAt', response.data.accessTokenExpiredAt);

                    res.end(html.successHTML);

                    vscode.window.showInformationMessage('Authentication successful!');
                } catch (error: any) {
                    res.end(html.errorHTML);

                    vscode.window.showErrorMessage(`Authentication failed!. Error during Azure authentication: ${error.message}`);
                }

                server.close();
                console.log('server stoped');
            }
        }
    });

    server.listen(17988, () => {
        console.log('Listening on port 17988...');
    });

    return {
        accessToken: await context.getValueAsunc('azureAccessToken'),
        accessTokenExpiredAt: await context.getValueAsunc('azureaccessTokenExpiredAt'),
        refreshToken: await context.getValueAsunc('azureRefreshToken'),
        idToken: await context.getValueAsunc('azureIdToken'),
    } as AzureTokenResponse;
};