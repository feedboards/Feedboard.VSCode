import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../html';
import * as constants from '../constants/APIRouts';
import axios from 'axios';

export const authenticateAzure = async () => {
    const response = await axios.get(`${constants.baseAPIURI}AzureOAuth/login-url`);

    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(response.data.url)
    );

    const server = http.createServer(async (req, res) => {
        if (req.url) {
            const queryObject = url.parse(req.url, true).query;
            if (queryObject.code && queryObject.state) {
                res.writeHead(200, { 'Content-Type': 'text/html' });

                const code = queryObject.code as string;
                vscode.window.showInformationMessage(`Received code: ${code}`);

                const state = queryObject.state as string;
                vscode.window.showInformationMessage(`Received state: ${state}`);

                try {
                    const response = await axios.get(`${constants.baseAPIURI}AzureOAuth/process-code?code=${code}&state=${state}`);

                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(html.successHTML);

                    vscode.window.showInformationMessage(`Access Token: ${response.data.access_token}`);
                    vscode.window.showInformationMessage('Authentication successful!');
                } catch (error: any) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(html.errorHTML);

                    vscode.window.showErrorMessage(`Error during GitHub authentication: ${error.message}`);
                    vscode.window.showErrorMessage('Authentication failed!');
                }

                server.close(() => {
                    console.log('server stoping');
                });
            }
        }
    });

    server.listen(17988, () => {
        console.log('Listening on port 3000...');
    });
};