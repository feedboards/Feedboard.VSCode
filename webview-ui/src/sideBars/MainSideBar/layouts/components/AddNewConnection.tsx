import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { ELayoutTypes, useGlobal, useLayout } from '../..';
import { ChangeEvent, useState } from 'react';
import { handleDropdownChange, vscode } from '../../../../utilities';
import { AddNewConnectionOAuth } from './AddNewConnectionOAuth';
import { ELoginType, EMainSideBarCommands, TConnection } from '../../../../../../src/helpers';
import { VSCodeInput } from '../../../../components';
import { v4 as uuidv4 } from 'uuid';

type TLoginType = {
    type: ELoginType;
    name: string;
};

export const AddNewConnection = () => {
    const [selectedLoginType, setSelectedLoginType] = useState<TLoginType | undefined>(undefined);
    const [name, setName] = useState<string>();
    const [loginTypes, setLoginTypes] = useState<TLoginType[]>([
        {
            type: ELoginType.connectionString,
            name: 'Connection string',
        },
        {
            type: ELoginType.oAuth,
            name: 'Azure account',
        },
    ]);

    const { changeLayoutType } = useLayout();
    const {
        isLoggedInAzure,
        setConnectionString,
        selectedSubscription,
        selectedResourceGroup,
        selectedNamespace,
        connectionString,
        addConnection,
    } = useGlobal();

    const onAdd = () => {
        if (name && selectedLoginType) {
            const connection: TConnection = {
                id: uuidv4(),
                name,
                settings: {
                    loginType: selectedLoginType?.type,
                    subscription: {
                        displayName: selectedSubscription?.displayName,
                        subscriptionId: selectedSubscription?.subscriptionId,
                    },
                    resourceGroup: {
                        name: selectedResourceGroup?.name,
                        id: selectedResourceGroup?.id,
                    },
                    namespace: {
                        name: selectedNamespace?.name,
                        id: selectedNamespace?.id,
                    },
                    connectionString: connectionString,
                },
            };

            vscode.postMessage({
                command: EMainSideBarCommands.addConnection,
                payload: connection,
            });

            addConnection(connection);
            changeLayoutType(ELayoutTypes.default);
        }
    };

    return (
        <div className="main-side-bar__wrapper_add-new-connection">
            <div className="main-side-bar__wrapper_add-new-connection_dropdown-group">
                <label htmlFor="connectioType">Login Type</label>
                <VSCodeDropdown
                    className="main-side-bar__wrapper_add-new-connection_dropdown"
                    id="connectioType"
                    onChange={(x) => {
                        handleDropdownChange<TLoginType>(x, setSelectedLoginType, loginTypes);
                    }}>
                    <VSCodeOption value="">Select a login type</VSCodeOption>
                    {loginTypes?.map((x, index: number) => (
                        <VSCodeOption key={index} value={x.type}>
                            {x.name}
                        </VSCodeOption>
                    ))}
                </VSCodeDropdown>
            </div>

            <VSCodeInput
                className="main-side-bar__input"
                placeholder="name"
                onChange={(x: ChangeEvent<HTMLInputElement>) => setName(x.target.value)}
            />

            {selectedLoginType === undefined && <></>}

            {selectedLoginType?.type === ELoginType.oAuth && (
                <>
                    {isLoggedInAzure ? (
                        <AddNewConnectionOAuth />
                    ) : (
                        <VSCodeButton
                            className="main-side-bar__wrapper_add-new-connection_button"
                            onClick={() => {
                                vscode.postMessage({
                                    command: EMainSideBarCommands.singInWithAzure,
                                });
                            }}>
                            Sing in with Azure
                        </VSCodeButton>
                    )}
                </>
            )}

            {selectedLoginType?.type === ELoginType.connectionString && (
                <VSCodeInput
                    className="main-side-bar__input"
                    onChange={(x: ChangeEvent<HTMLInputElement>) => setConnectionString(x.target.value)}
                    placeholder="Connection string"
                />
            )}

            <div className="main-side-bar__wrapper_add-new-connection_button-group">
                <VSCodeButton appearance="secondary" onClick={() => changeLayoutType(ELayoutTypes.default)}>
                    close
                </VSCodeButton>
                <VSCodeButton onClick={onAdd}>Add</VSCodeButton>
            </div>
        </div>
    );
};
