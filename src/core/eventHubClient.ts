import {
    EventHubConsumerClient,
    ProcessErrorHandler,
    ProcessEventsHandler,
    Subscription,
    earliestEventPosition,
} from '@azure/event-hubs';
import { Constnants } from '../constants';

export class EventHubClient {
    private readonly _client: EventHubConsumerClient;

    private _subscription: Subscription | undefined;

    constructor(consumerGroup: string, eventHubName: string, connectionString: string) {
        this._client = new EventHubConsumerClient(consumerGroup, connectionString, eventHubName);
    }

    public static test() {}

    public startMonitoring(processEvents: ProcessEventsHandler, processError?: ProcessErrorHandler): void {
        if (Constnants.isMonitoring) {
            console.log('Monitoring is already active.');
            return;
        }

        Constnants.isMonitoring = true;

        try {
            const handleError =
                processError ||
                ((error, context) => {
                    return Promise.resolve();
                });

            this._subscription = this._client.subscribe(
                {
                    processEvents: (events, context) => {
                        console.log(`Processing event at ${new Date().toISOString()}: `, events);
                        return processEvents(events, context);
                    },
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
            Constnants.isMonitoring = false;
        }
    }

    public async closeClient(): Promise<void> {
        if (this._client) {
            await this._client.close();
            Constnants.isMonitoring = false;
        }
    }
}
