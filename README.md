# feedboard vscode plaguin with (React + Vite)

## setup vscode setting in .vecode folder

carete a folder `.vscode` in this folder create these files

`tasks.json`

```json
{
    "version": "2.0.0",
    "tasks": [
        {
            "type": "npm",
            "script": "watch",
            "problemMatcher": "$tsc-watch",
            "isBackground": true,
            "presentation": {
                "reveal": "never"
            },
            "group": {
                "kind": "build",
                "isDefault": true
            }
        }
    ]
}
```

`launch.json`

```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "name": "Run Extension",
            "type": "extensionHost",
            "request": "launch",
            "args": ["--extensionDevelopmentPath=${workspaceFolder}"],
            "outFiles": ["${workspaceFolder}/out/**/*.js"]
        },
        {
            "name": "Extension Tests",
            "type": "extensionHost",
            "request": "launch",
            "args": [
                "--extensionDevelopmentPath=${workspaceFolder}",
                "--extensionTestsPath=${workspaceFolder}/out/test/suite/index"
            ],
            "outFiles": ["${workspaceFolder}/out/test/**/*.js"],
            "preLaunchTask": "yarn build:webview && yarn watch"
        }
    ]
}
```

## setup feedboard-core lib

u need to create `.npmrc` file in root directory then u need to add this code in file `.npmrc`

also if u want u can copy example from `example.npmrc`

```bash
@katyara1:registry=https://npm.pkg.github.com/
//npm.pkg.github.com/:_authToken=UR_GITHUB_TOKEN
```

## Run the app

```bash
# Install dependencies for both the extension and webview UI source code
yarn install:all

# Build webview UI source code
yarn build:webview
```

Once the app is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window

b626f4e2-744f-418d-a56f-2ae3f3f32314
| Description | Expires | Value | Secret ID|
| ------------- | ----- | ------ | ------- |
| DefaultSecret | 5/26/2026 |2f58Q~l7_A3fONLe1e1nehRuYqr4YoXFHlDIxc6f | b626f4e2-744f-418d-a56f-2ae3f3f32314
