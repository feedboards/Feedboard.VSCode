# Environments

## setup vscode setting in the .vecode folder

create a folder `.vscode` in this folder, and create these files

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

## install all libs

```bash
# Install dependencies for both the extension and webview UI source code
yarn install:all
```

## Run the application

Once the application is open inside VS Code you can run the extension by doing the following:

1. Press `F5` to open a new Extension Development Host window

## Watch

```bash
# Watch only webview UI source code
yarn watch:ui

# Watch only extention source code
yarn watch
```

## Build the application

### Build for Developer

```bash
# Build only webview UI source code
yarn build:ui

# Build only extention source code
yarn build

# Build they both sources code
yarn build:all
```

### Build for production

install `vsce` package

using npm

```bash
npm i -g vsce
```

or yarn (but you can get an error like `ObjectNotFound: (vsce:String)` when you try to build the application)

```bash
yarn global add vsce
```

make a folder `build`

```bash
mkdir build
```

build the application

```
vsce package -o build/feedboard-<version>.vsix
```

> [!IMPORTANT]
> Port 17988 is the Azure server port.
>
> Port 17989 is the GitHub server port.
