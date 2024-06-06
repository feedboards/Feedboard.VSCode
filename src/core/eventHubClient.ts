import {
    EventHubConsumerClient,
    ProcessErrorHandler,
    ProcessEventsHandler,
    Subscription,
    earliestEventPosition,
} from '@azure/event-hubs';
import { TokenCredential } from '@azure/identity';

export class EventHubClient {
    private readonly _client: EventHubConsumerClient;

    private _subscription: Subscription | undefined;

    constructor(connectionString: string, eventHubName: string, consumerGroup?: string);
    constructor(namespace: string, credential: TokenCredential, eventHubName: string, consumerGroup?: string);

    constructor(
        connectionStringOrnamespace: string,
        eventHubNameOrCredential: string | TokenCredential,
        eventHubNameOrConsumerGroup?: string,
        consumerGroup?: string
    ) {
        let consumerGroupLocal: string = consumerGroup ?? eventHubNameOrConsumerGroup ?? '$Default';

        if (typeof eventHubNameOrCredential === 'string') {
            this._client = new EventHubConsumerClient(
                consumerGroupLocal,
                connectionStringOrnamespace,
                eventHubNameOrCredential
            );
        } else {
            this._client = new EventHubConsumerClient(
                consumerGroupLocal,
                connectionStringOrnamespace,
                consumerGroupLocal,
                eventHubNameOrCredential
            );
        }
    }

    public startMonitoring(processEvents: ProcessEventsHandler, processError?: ProcessErrorHandler): void {
        try {
            const handleError =
                processError ||
                ((error, context) => {
                    return Promise.resolve();
                });

            this._subscription = this._client.subscribe(
                {
                    processEvents,
                    processError: handleError,
                },
                { startPosition: earliestEventPosition }
            );
        } catch (error) {
            throw error;
        }
    }

    public async stopMonitoring(): Promise<void> {
        if (this._subscription) {
            await this._subscription.close();
        }
    }

    public async closeClient(): Promise<void> {
        if (this._client) {
            await this._client.close();
        }
    }
}

// import { EHNamespace, EventHubManagementClient, Eventhub } from '@azure/arm-eventhub';
// import { Subscription } from '@azure/arm-subscriptions';
// import { TokenCredential } from '@azure/identity';
// import { AzureClient } from '../clients';
// import { ResourceGroup } from '@azure/arm-resources';

// export class EventHubClient {
//     private readonly _eventHubClient: EventHubManagementClient;
//     // private readonly _azureClient: AzureClient;

//     constructor(credentials: TokenCredential, subscriptionId: string) {
//         this._eventHubClient = new EventHubManagementClient(credentials, subscriptionId);
//         // this._azureClient = new AzureClient(credentials);
//     }

//     // public async getSubscriptions(): Promise<Subscription[]> {
//     //     return await this._azureClient.getSubscriptions();
//     // }

//     // public async getResourceGroups(subscriptionId: string): Promise<ResourceGroup[]> {
//     //     return await this._azureClient.getResourceGroups(subscriptionId);
//     // }

//     // public async getNamespacesByresourceGroup(
//     //     subscriptionId: string,
//     //     resourceGroupName: string
//     // ): Promise<EHNamespace[]> {
//     //     return await this._azureClient.getNamespacesByresourceGroup(subscriptionId, resourceGroupName);
//     // }

//     // public async getEventHubsByNamespace(
//     //     subscriptionId: string,
//     //     resourceGroupName: string,
//     //     namespaceName: string
//     // ): Promise<Eventhub[]> {
//     //     return await this._azureClient.getEventHubsByNamespace(subscriptionId, resourceGroupName, namespaceName);
//     // }

//     public async stopMonitoring(): Promise<void> {
//         this._eventHubClient;
//     }

//     public async closeClient(): Promise<void> {}
// }

// import { EventHubClient, MessagingError } from 'azure-event-hubs';

// export class EventHubHelper {
//     private _eventHubClient: EventHubClient | undefined;
//     public startMonitoring(connectionString: string, path: string, consumerGroup: string = '$Default') {
//         this._eventHubClient = EventHubClient.createFromConnectionString(connectionString, path);
//         this._eventHubClient?.getPartitionIds().then((ids) => {
//             return ids.map((x) => {
//                 return this._eventHubClient?.receive(
//                     x,
//                     (eventData) => {
//                         console.log(eventData);
//                     },
//                     (error: MessagingError | Error) => {
//                         console.log(error);
//                     }
//                 );
//             });
//         });
//         // this._eventHubClient.
//     }
// }
