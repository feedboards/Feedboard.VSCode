import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import * as html from '../html';
import * as constants from '../constants/APIRouts';
import axios from 'axios';

export const authenticateGitHub = async () => {
    const response = await axios.get(`${constants.baseAPIURI}GitHubOauth/login`);

    vscode.commands.executeCommand(
        'vscode.open',
        vscode.Uri.parse(response.data.url)
    );

    const server = http.createServer(async (req, res) => {
        if (req.url) {
            const queryObject = url.parse(req.url, true).query;
            if (queryObject.code) {                      
                res.writeHead(200, { 'Content-Type': 'text/html' });

                const code = queryObject.code as string;
                vscode.window.showInformationMessage(`Received code: ${code}`);

                try {
                    const response = await axios.get(`${constants.baseAPIURI}GitHubOauth/callback?code=${code}`);

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

    server.listen(17989, () => {
        console.log('Listening on port 3000...');
    });
};  
