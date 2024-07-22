import { VSCodeDropdown, VSCodeOption } from '@vscode/webview-ui-toolkit/react';
import { addLoading, handleDropdownChange, vscode } from '../../../../utilities';
import { Subscription } from '@azure/arm-subscriptions';
import { ResourceGroup } from '@azure/arm-resources';
import { EHNamespace } from '@azure/arm-eventhub';
import { IAddNewConnectionOAuth, useGlobal } from '../..';
import classNames from 'classnames';
import { EMainSideBarCommands } from '../../../../../../common/commands';
import { isOAuthType } from '../../../../../../common/types';

export const AddNewConnectionOAuth = ({
    subscriptionsError,
    resourceGroupsError,
    namespacesError,
    setSubscriptionsError,
    setResourceGroupsError,
    setNamespacesError,
    connection,
}: IAddNewConnectionOAuth) => {
    const {
        setSelectedSubscription,
        setResourceGroupLoading,
        setSelectedResourceGroup,
        setNamespaceLoading,
        setSelectedNamespace,
        subscriptions,
        subscriptionLoading,
        selectedSubscription,
        resourceGroups,
        resourceGroupLoading,
        selectedResourceGroup,
        namespaces,
        namespaceLoading,
    } = useGlobal();

    const onChangeSubscriptions = (x: undefined | Subscription) => {
        setSelectedSubscription(x);
        setSelectedResourceGroup(undefined);
        setSelectedNamespace(undefined);

        if (x !== undefined) {
            setSubscriptionsError(false);
            setResourceGroupsError(false);
            setNamespacesError(false);

            vscode.postMessage({
                command: EMainSideBarCommands.getResourceGroups,
                payload: {
                    subscriptionId: x.subscriptionId,
                },
            });

            setResourceGroupLoading(true);
        }
    };

    const onChangeresourceGroups = (x: undefined | ResourceGroup) => {
        setSelectedResourceGroup(x);
        setSelectedNamespace(undefined);

        if (x !== undefined) {
            setResourceGroupsError(false);
            setNamespacesError(false);

            vscode.postMessage({
                command: EMainSideBarCommands.getNamespaces,
                payload: {
                    subscriptionId: selectedSubscription?.subscriptionId,
                    resourceGroupName: x.name,
                },
            });

            setNamespaceLoading(true);
        }
    };

    const onChangeNamespaces = (x: undefined | EHNamespace) => {
        setSelectedNamespace(x);

        console.log('onChangeNamespaces', x);

        if (x !== undefined) {
            setNamespacesError(false);

            vscode.postMessage({
                command: EMainSideBarCommands.getEventHubs,
                payload: {
                    subscriptionId: selectedSubscription?.subscriptionId,
                    resourceGroupName: selectedResourceGroup?.name,
                    namespaceName: x.name,
                },
            });
        }
    };

    const subscriptionDropdownValue =
        connection !== undefined && isOAuthType(connection.settings)
            ? connection.settings.subscription.subscriptionId
            : '';

    const resourceGroupDropdownValue =
        connection !== undefined && isOAuthType(connection.settings) ? connection.settings.resourceGroup.name : '';

    const namespacesDropdownValue =
        connection !== undefined && isOAuthType(connection.settings) ? connection.settings.namespace.name : '';

    return (
        <>
            <div className="main-side-bar__wrapper_add-new-connection_container">
                <label htmlFor="subscriptions">Subscriptions</label>
                <VSCodeDropdown
                    id="subscriptions"
                    defaultValue={subscriptionDropdownValue}
                    className={classNames('main-side-bar__wrapper_add-new-connection_dropdown', {
                        ['main-side-bar__wrapper_add-new-connection_dropdown_error']: subscriptionsError,
                    })}
                    onChange={(x) =>
                        subscriptions && handleDropdownChange<Subscription>(x, onChangeSubscriptions, subscriptions)
                    }>
                    {addLoading(
                        subscriptionLoading,
                        <>
                            <VSCodeOption value="">Select a subscription</VSCodeOption>
                            {subscriptions?.map((x: Subscription, index: number) => (
                                <VSCodeOption key={index} value={x.subscriptionId}>
                                    {x.displayName}
                                </VSCodeOption>
                            ))}
                        </>
                    )}
                </VSCodeDropdown>
            </div>
            {selectedSubscription !== undefined && (
                <div className="main-side-bar__wrapper_add-new-connection_container">
                    <label htmlFor="resourceGroups">Resource Groups</label>
                    <VSCodeDropdown
                        id="resourceGroups"
                        defaultValue={resourceGroupDropdownValue}
                        className={classNames('main-side-bar__wrapper_add-new-connection_dropdown', {
                            ['main-side-bar__wrapper_add-new-connection_dropdown_error']: resourceGroupsError,
                        })}
                        onChange={(x) =>
                            resourceGroups &&
                            handleDropdownChange<ResourceGroup>(x, onChangeresourceGroups, resourceGroups)
                        }>
                        {addLoading(
                            resourceGroupLoading,
                            <>
                                <VSCodeOption value="">Select a resource group</VSCodeOption>
                                {resourceGroups?.map((x: ResourceGroup, index: number) => (
                                    <VSCodeOption key={index} value={x.name}>
                                        {x.name}
                                    </VSCodeOption>
                                ))}
                            </>
                        )}
                    </VSCodeDropdown>
                </div>
            )}
            {selectedSubscription !== undefined && selectedResourceGroup !== undefined && (
                <div className="main-side-bar__wrapper_add-new-connection_container">
                    <label htmlFor="namespaces">Namespaces</label>
                    <VSCodeDropdown
                        id="namespaces"
                        defaultValue={namespacesDropdownValue}
                        className={classNames('main-side-bar__wrapper_add-new-connection_dropdown', {
                            ['main-side-bar__wrapper_add-new-connection_dropdown_error']: namespacesError,
                        })}
                        onChange={(x) =>
                            namespaces && handleDropdownChange<EHNamespace>(x, onChangeNamespaces, namespaces)
                        }>
                        {addLoading(
                            namespaceLoading,
                            <>
                                <VSCodeOption value="">Select a namespace</VSCodeOption>
                                {namespaces?.map((x: EHNamespace, index: number) => (
                                    <VSCodeOption key={index} value={x.name}>
                                        {x.name}
                                    </VSCodeOption>
                                ))}
                            </>
                        )}
                    </VSCodeDropdown>
                </div>
            )}
        </>
    );
};
