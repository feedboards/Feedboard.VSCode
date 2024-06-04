export const successHTML = /*html*/ `
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

export const errorHTML = /*html*/ `
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