import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { ELayoutTypes, useGlobal, useLayout } from '../..';
import { ChangeEvent, useState } from 'react';
import { handleDropdownChange, vscode } from '../../../../utilities';
import { AddNewConnectionOAuth } from './AddNewConnectionOAuth';
import { ELoginType, EMainSideBarCommands, TConnection } from '../../../../../../src/helpers';
import { VSCodeInput } from '../../../../components';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';

type TLoginType = {
    type: ELoginType;
    name: string;
};

export const AddNewConnection = () => {
    const [nameError, setNameError] = useState<boolean>(false);
    const [connectionStringError, setConnectionStringError] = useState<boolean>(false);
    const [loginTypeError, setLoginTypeError] = useState<boolean>(false);
    const [subscriptionsError, setSubscriptionsError] = useState<boolean>(false);
    const [resourceGroupsError, setResourceGroupsError] = useState<boolean>(false);
    const [namespacesError, setNamespacesError] = useState<boolean>(false);

    const [selectedLoginType, setSelectedLoginType] = useState<TLoginType | undefined>(undefined);
    const [name, setName] = useState<string | undefined>(undefined);
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

    const onSetDropdown = (x: TLoginType | undefined) => {
        if (x !== undefined) {
            setNameError(false);
            setConnectionStringError(false);
            setLoginTypeError(false);

            setSelectedLoginType(x);
        }
    };

    const onChangeName = (x: ChangeEvent<HTMLInputElement>) => {
        if (x.target.value !== undefined && x.target.value !== '') {
            setNameError(false);
            setConnectionStringError(false);
        }

        setName(x.target.value);
    };

    const onChangeConnectionString = (x: ChangeEvent<HTMLInputElement>) => {
        if (x.target.value !== undefined && x.target.value !== '') {
            setConnectionStringError(false);
        }

        setConnectionString(x.target.value);
    };

    const onAdd = () => {
        if (name === undefined || name === '') {
            setNameError(true);
        }

        if (selectedLoginType === undefined) {
            setLoginTypeError(true);
        }

        if (selectedLoginType !== undefined && selectedLoginType.type === ELoginType.connectionString) {
            if (connectionString === undefined || connectionString === '') {
                setConnectionStringError(true);
            }
        } else if (selectedLoginType !== undefined && selectedLoginType.type === ELoginType.oAuth) {
            console.log(
                'selectedSubscription',
                selectedSubscription,
                'selectedResourceGroup',
                selectedResourceGroup,
                'selectedNamespace',
                selectedNamespace
            );

            if (selectedSubscription === undefined) {
                setSubscriptionsError(true);
            }

            if (selectedResourceGroup === undefined) {
                setResourceGroupsError(true);
            }

            if (selectedNamespace === undefined) {
                setNamespacesError(true);
            }
        }

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
                    className={classNames('main-side-bar__wrapper_add-new-connection_dropdown', {
                        ['main-side-bar__wrapper_add-new-connection_dropdown_error']: loginTypeError,
                    })}
                    id="connectioType"
                    onChange={(x) => {
                        handleDropdownChange<TLoginType>(x, onSetDropdown, loginTypes);
                    }}>
                    <VSCodeOption value="">Select a login type</VSCodeOption>
                    {loginTypes?.map((x, index: number) => (
                        <VSCodeOption key={index} value={x.type}>
                            {x.name}
                        </VSCodeOption>
                    ))}
                </VSCodeDropdown>
                {loginTypeError && (
                    <div className="main-side-bar__error-message_with-under-gap">this field is required</div>
                )}
            </div>

            <label htmlFor="name" className="main-side-bar__lable">
                Name
            </label>

            <VSCodeInput
                className="main-side-bar__input"
                id="name"
                isError={nameError}
                placeholder="name"
                onChange={onChangeName}
            />

            {nameError && <div className="main-side-bar__error-message">this field is required</div>}

            {selectedLoginType === undefined && <></>}

            {selectedLoginType?.type === ELoginType.oAuth && (
                <>
                    {isLoggedInAzure ? (
                        <AddNewConnectionOAuth
                            subscriptionsError={subscriptionsError}
                            resourceGroupsError={resourceGroupsError}
                            namespacesError={namespacesError}
                            setSubscriptionsError={setSubscriptionsError}
                            setResourceGroupsError={setResourceGroupsError}
                            setNamespacesError={setNamespacesError}
                        />
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
                <>
                    <label htmlFor="connectionString" className="main-side-bar__lable">
                        Connection String
                    </label>
                    <VSCodeInput
                        id="connectionString"
                        className="main-side-bar__input"
                        isError={connectionStringError}
                        onChange={onChangeConnectionString}
                        placeholder="Connection string"
                    />
                    {connectionStringError && (
                        <div className="main-side-bar__error-message">this field is required</div>
                    )}
                </>
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
