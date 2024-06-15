import {
    AuthorizationRule,
    ConsumerGroup,
    EHNamespace,
    EventHubManagementClient,
    Eventhub,
    NamespacesListKeysResponse,
} from '@azure/arm-eventhub';
import { ResourceGroup, ResourceManagementClient } from '@azure/arm-resources';
import { Subscription, SubscriptionClient } from '@azure/arm-subscriptions';
import { TokenCredential } from '@azure/identity';

export class AzureClient {
    public _credential: TokenCredential;

    constructor(credential: TokenCredential) {
        this._credential = credential;
    }

    public async getSubscriptions(): Promise<Subscription[]> {
        const client = new SubscriptionClient(this._credential);
        const result: Subscription[] = [];

        for await (const subscription of client.subscriptions.list()) {
            result.push(subscription);
        }

        return result;
    }

    public async getResourceGroups(subscriptionId: string): Promise<ResourceGroup[]> {
        const client = new ResourceManagementClient(this._credential, subscriptionId);
        const result: ResourceGroup[] = [];

        for await (const resourceGroup of client.resourceGroups.list()) {
            result.push(resourceGroup);
        }

        return result;
    }

    public async getNamespacesByResourceGroup(
        subscriptionId: string,
        resourceGroupName: string
    ): Promise<EHNamespace[]> {
        const client = new EventHubManagementClient(this._credential, subscriptionId);
        const result: EHNamespace[] = [];

        for await (const namespace of client.namespaces.listByResourceGroup(resourceGroupName)) {
            result.push(namespace);
        }

        return result;
    }

    public async getEventHubsByNamespace(
        subscriptionId: string,
        resourceGroupName: string,
        namespaceName: string
    ): Promise<Eventhub[]> {
        const client = new EventHubManagementClient(this._credential, subscriptionId);
        const result: Eventhub[] = [];

        for await (const eventHub of client.eventHubs.listByNamespace(resourceGroupName, namespaceName)) {
            result.push(eventHub);
        }

        return result;
    }

    public async getConsumerGroups(
        subscriptionId: string,
        resourceGroupName: string,
        namespaceName: string,
        eventHubName: string
    ): Promise<ConsumerGroup[]> {
        const client = new EventHubManagementClient(this._credential, subscriptionId);
        const result: ConsumerGroup[] = [];

        for await (const consumerGroup of client.consumerGroups.listByEventHub(
            resourceGroupName,
            namespaceName,
            eventHubName
        )) {
            result.push(consumerGroup);
        }

        return result;
    }

    public async getAuthorizationRules(
        subscriptionId: string,
        resourceGroupName: string,
        namespaceName: string
    ): Promise<AuthorizationRule[]> {
        const client = new EventHubManagementClient(this._credential, subscriptionId);
        const result: AuthorizationRule[] = [];

        for await (const rules of client.namespaces.listAuthorizationRules(resourceGroupName, namespaceName)) {
            result.push(rules);
        }

        return result;
    }

    public async getKeys(
        subscriptionId: string,
        resourceGroupName: string,
        namespaceName: string,
        authorizationRuleName: string
    ): Promise<NamespacesListKeysResponse> {
        const client = new EventHubManagementClient(this._credential, subscriptionId);
        return await client.namespaces.listKeys(resourceGroupName, namespaceName, authorizationRuleName);
    }
}
