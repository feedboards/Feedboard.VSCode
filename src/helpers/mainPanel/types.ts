export type TMainPanelPayload =
    | undefined
    | TMainPanelGetResourceGroups
    | TMainPanelGetNamespaces
    | TMainPanelGetEventHubs
    | TMainPanelGetConsumerGroups
    | TMainPanelStartMonitoring;

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
    namespaceName: string;
    eventHubName: string;
    consumerGroupName: string;
};
