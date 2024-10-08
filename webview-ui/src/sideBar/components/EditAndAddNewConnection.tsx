import { VSCodeButton, VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { ChangeEvent, useEffect, useState } from 'react';
import { AddNewConnectionOAuth } from './AddNewConnectionOAuth';
import { v4 as uuidv4 } from 'uuid';
import classNames from 'classnames';
import {
    ELoginType,
    isTConnectionMQTT,
    isTConnectionSettingsAzureConnectionString,
    isTConnectionSettingsAzureOAuth,
    TConnection,
} from '@feedboard/feedboard.core';
import { ELayoutTypes, IEditAndAddNewConnection } from '../types';
import { useGlobal, useLayout } from '../contexts';
import { handleDropdownChange, vscode } from '../../utilities';
import { ESideBarCommands } from '../../../../common/commands';
import { VSCodeInput } from '../../components';

type TLoginType = {
    type: ELoginType;
    name: string;
};

const loginTypes: TLoginType[] = [
    {
        type: ELoginType.connectionString,
        name: 'Connection string',
    },
    {
        type: ELoginType.azureOAuth,
        name: 'Azure account',
    },
    {
        type: ELoginType.mqtt,
        name: 'MQTT',
    },
];

export const EditAndAddNewConnection = ({ connection, setConnection }: IEditAndAddNewConnection) => {
    //#region Name
    const [nameError, setNameError] = useState<boolean>(false);
    const [name, setName] = useState<string | undefined>(undefined);
    //#endregion

    //#region Login
    const [selectedLoginType, setSelectedLoginType] = useState<TLoginType | undefined>(undefined);
    const [loginTypeError, setLoginTypeError] = useState<boolean>(false);
    //#endregion

    //#region EventHub
    //#region EventHub ConnetionString
    const [connectionStringError, setConnectionStringError] = useState<boolean>(false);
    const [connectionString, setConnectionString] = useState<undefined | string>(undefined);
    //#endregion

    //#region EventHub OAuth
    const [subscriptionsError, setSubscriptionsError] = useState<boolean>(false);
    const [resourceGroupsError, setResourceGroupsError] = useState<boolean>(false);
    const [namespacesError, setNamespacesError] = useState<boolean>(false);
    //#endregion
    //#endregion

    //#region MQTT
    const [hostError, setHostError] = useState<boolean>(false);
    const [host, setHost] = useState<string | undefined>(undefined);
    //#endregion

    const { changeLayoutType } = useLayout();
    const { isLoggedInAzure, selectedSubscription, selectedResourceGroup, selectedNamespace, addConnection } =
        useGlobal();

    useEffect(() => {
        if (connection) {
            setName(connection.name);
            setSelectedLoginType({
                type: connection.settings.loginType,
                name: loginTypes.find((x) => x.type === connection.settings.loginType)?.name as string,
            });

            if (isTConnectionSettingsAzureConnectionString(connection.settings)) {
                setConnectionString(connection.settings.connectionString);
            }

            if (isTConnectionMQTT(connection.settings)) {
                setHost(connection.settings.host);
            }
        }
    }, []);

    const onSetDropdown = (x: TLoginType | undefined) => {
        if (x !== undefined) {
            setNameError(false);
            setConnectionStringError(false);
            setLoginTypeError(false);
        }

        setSelectedLoginType(x);
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

    const onChangeHost = (x: ChangeEvent<HTMLInputElement>) => {
        if (x.target.value !== undefined && x.target.value !== '') {
            setHostError(false);
        }

        setHost(x.target.value);
    };

    const validateData = () => {
        if (name === undefined || name === '') {
            setNameError(true);
        }

        if (selectedLoginType === undefined) {
            setLoginTypeError(true);
        }

        if (selectedLoginType == undefined) {
            return;
        }

        switch (selectedLoginType.type) {
            case ELoginType.connectionString:
                if (connectionString === undefined || connectionString === '') {
                    setConnectionStringError(true);
                }
                break;

            case ELoginType.azureOAuth:
                if (selectedSubscription === undefined) {
                    setSubscriptionsError(true);
                }

                if (selectedResourceGroup === undefined) {
                    setResourceGroupsError(true);
                }

                if (selectedNamespace === undefined) {
                    setNamespacesError(true);
                }
                break;

            case ELoginType.mqtt:
                if (host === undefined) {
                    setHostError(true);
                }
                break;
        }
    };

    const onEdit = () => {
        if (
            name == undefined ||
            (selectedLoginType == undefined &&
                selectedNamespace == undefined &&
                selectedSubscription == undefined &&
                selectedResourceGroup == undefined) ||
            connection == undefined
        ) {
            changeLayoutType(ELayoutTypes.connectionList);

            return;
        }

        if (name && selectedLoginType) {
            const editConnection: TConnection = {
                id: uuidv4(),
                name,
                settings: {
                    loginType: selectedLoginType !== undefined ? selectedLoginType.type : connection.settings.loginType,
                    subscription: {
                        displayName:
                            selectedSubscription === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.subscription.displayName
                                : selectedSubscription?.displayName,
                        subscriptionId:
                            selectedSubscription === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.subscription.subscriptionId
                                : selectedSubscription?.subscriptionId,
                    },
                    resourceGroup: {
                        name:
                            selectedResourceGroup === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.resourceGroup.name
                                : selectedResourceGroup?.name,
                        id:
                            selectedResourceGroup === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.resourceGroup.id
                                : selectedResourceGroup?.id,
                    },
                    namespace: {
                        name:
                            selectedNamespace === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.namespace.name
                                : selectedNamespace?.name,
                        id:
                            selectedNamespace === undefined && isTConnectionSettingsAzureOAuth(connection.settings)
                                ? connection.settings.namespace.id
                                : selectedNamespace?.id,
                    },
                    connectionString: connectionString,
                    host: host,

                    // TODO fix
                    eventHub: {
                        id: undefined,
                        name: undefined,
                    },
                    consumerGroup: {
                        id: undefined,
                        name: undefined,
                    },
                },
            };

            vscode.postMessage({
                command: ESideBarCommands.updateConnection,
                payload: editConnection,
            });

            addConnection(connection);
            changeLayoutType(ELayoutTypes.connectionList);
        }
    };

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
                    host: host,

                    // TODO fix
                    eventHub: {
                        id: undefined,
                        name: undefined,
                    },
                    consumerGroup: {
                        id: undefined,
                        name: undefined,
                    },
                },
            };

            vscode.postMessage({
                command: ESideBarCommands.addConnection,
                payload: connection,
            });

            addConnection(connection);
            changeLayoutType(ELayoutTypes.connectionList);
        }
    };

    const renderLogin = (): JSX.Element => {
        switch (selectedLoginType?.type) {
            case ELoginType.azureOAuth:
                return (
                    <>
                        {isLoggedInAzure ? (
                            <AddNewConnectionOAuth
                                subscriptionsError={subscriptionsError}
                                resourceGroupsError={resourceGroupsError}
                                namespacesError={namespacesError}
                                setSubscriptionsError={setSubscriptionsError}
                                setResourceGroupsError={setResourceGroupsError}
                                setNamespacesError={setNamespacesError}
                                connection={connection}
                            />
                        ) : (
                            <VSCodeButton
                                className="main-side-bar__wrapper_add-new-connection_button"
                                onClick={() => {
                                    vscode.postMessage({
                                        command: ESideBarCommands.singInWithAzure,
                                    });
                                }}>
                                Sing in with Azure
                            </VSCodeButton>
                        )}
                    </>
                );

            case ELoginType.connectionString:
                return (
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
                            value={connectionString}
                        />
                        {connectionStringError && (
                            <div className="main-side-bar__error-message">this field is required</div>
                        )}
                    </>
                );

            case ELoginType.mqtt:
                return (
                    <>
                        <label htmlFor="connectionString" className="main-side-bar__lable">
                            Host
                        </label>
                        <VSCodeInput
                            id="host"
                            className="main-side-bar__input"
                            isError={hostError}
                            onChange={onChangeHost}
                            placeholder="Host"
                            value={host}
                        />
                        {hostError && <div className="main-side-bar__error-message">this field is required</div>}
                    </>
                );

            default:
                return <></>;
        }
    };

    return (
        <div className="main-side-bar__wrapper_add-new-connection">
            <div className="main-side-bar__wrapper_add-new-connection_dropdown-group">
                <label htmlFor="connectioType">Login Type</label>
                <VSCodeDropdown
                    value={selectedLoginType?.type}
                    className={classNames('main-side-bar__wrapper_add-new-connection_dropdown', {
                        ['main-side-bar__wrapper_add-new-connection_dropdown_error']: loginTypeError,
                    })}
                    id="connectioType"
                    onChange={(x) => {
                        handleDropdownChange<TLoginType>(x, onSetDropdown, loginTypes);
                    }}>
                    <VSCodeOption value="">Select a login type</VSCodeOption>
                    {loginTypes?.map((x, index: number) => {
                        return (
                            <VSCodeOption key={index} value={x.type}>
                                {x.name}
                            </VSCodeOption>
                        );
                    })}
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
                value={name}
                placeholder="name"
                onChange={onChangeName}
            />

            {nameError && <div className="main-side-bar__error-message">this field is required</div>}

            {renderLogin()}

            <div className="main-side-bar__wrapper_add-new-connection_button-group">
                <VSCodeButton
                    appearance="secondary"
                    onClick={() => {
                        setConnection(undefined);
                        changeLayoutType(ELayoutTypes.connectionList);
                    }}>
                    close
                </VSCodeButton>
                <VSCodeButton
                    onClick={() => {
                        validateData();

                        if (connection) {
                            onEdit();
                            setConnection(undefined);
                            return;
                        }

                        onAdd();
                    }}>
                    {connection !== undefined ? 'Confirm' : 'Add'}
                </VSCodeButton>
            </div>
        </div>
    );
};
