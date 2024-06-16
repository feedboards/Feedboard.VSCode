# feedboard vscode plugin with (React + Vite)

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

## Setup feedboard-core lib

you need to create a `.npmrc` file in the root directory, and then you need to add this code in the file `.npmrc`

also, if you want you can copy the example from `example.npmrc`

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

> [!IMPORTANT]
> port 17988 is the Azure server port
> port 17989 is the GitHub server port

## Build the application

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
