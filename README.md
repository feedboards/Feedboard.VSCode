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

## Run the app

```bash
# Install dependencies for both the extension and webview UI source code
yarn install:all

# Build webview UI source code
yarn build:webview
```

Once the app is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window
