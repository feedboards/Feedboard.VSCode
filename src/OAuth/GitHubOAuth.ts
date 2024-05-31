import * as vscode from 'vscode';
import * as http from 'http';
import * as url from 'url';
import axios from 'axios';

export const authenticateGitHub = async () => {
    const response = await axios.get('http://localhost:5094/GitHubOauth/login');

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
                    const response = await axios.get(`http://localhost:5094/GitHubOauth/callback?code=${code}`);

                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(successHTML);

                    vscode.window.showInformationMessage(`Access Token: ${response.data.access_token}`);
                } catch (error: any) {
                    res.writeHead(500, { 'Content-Type': 'text/html' });
                    res.end(errorHTML);

                    vscode.window.showErrorMessage(`Error during GitHub authentication: ${error.message}`);
                }
                
                server.close();
            }
        }
    });

    server.listen(3000, () => {
        console.log('Listening on port 3000...');
    });
};  

const successHTML = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Successful</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .container {
            display: inline-block;
            padding: 20px;
            border: 2px solid #4CAF50;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
        .success {
            color: #4CAF50;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="success">Authentication successful!</div>
        <p>You can close this window.</p>
    </div>
</body>
</html>`;

const errorHTML = /*html*/ `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authentication Failed</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin-top: 50px;
        }
        .container {
            display: inline-block;
            padding: 20px;
            border: 2px solid #FF0000;
            border-radius: 10px;
            background-color: #f9f9f9;
        }
        .error {
            color: #FF0000;
            font-size: 24px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="error">Authentication failed!</div>
        <p>There was an error during the authentication process. Please try again.</p>
    </div>
</body>
</html>
`;