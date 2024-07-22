export type TMainPanelPayload =
    | undefined
    | string
    | TMainPanelGetResourceGroups
    | TMainPanelGetNamespaces
    | TMainPanelGetEventHubs
    | TMainPanelGetConsumerGroups
    | TMainPanelStartMonitoring
    | TMainPanelStartMonitoringByConnectionString;

export type TMainPanelGetResourceGroups = {
    subscriptionId: string;
};

export type TMainPanelGetNamespaces = TMainPanelGetResourceGroups & {
    resourceGroupName: string;
};

export type TMainPanelGetEventHubs = TMainPanelGetNamespaces & {
    namespaceName: string;
};

export type TMainPanelGetConsumerGroups = TMainPanelGetEventHubs & {
    eventHubName: string;
};

export type TMainPanelStartMonitoring = {
    subscriptionId: string;
    resourceGroupName: string;
    namespaceName: string;
    eventHubName: string;
    consumerGroupName: string;
};

export type TMainPanelStartMonitoringByConnectionString = {
    eventHubName: string;
    consumerGroupName: string;
    connectionString: string;
};
