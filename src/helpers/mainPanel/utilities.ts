import {
    TMainPanelGetConsumerGroups,
    TMainPanelGetEventHubs,
    TMainPanelGetNamespaces,
    TMainPanelGetResourceGroups,
    TMainPanelStartMonitoring,
} from '.';

export const isTMainPanelGetResourceGroups = (obj: any): obj is TMainPanelGetResourceGroups => {
    return obj && typeof obj === 'object' && 'subscriptionId' in obj;
};

export const isTMainPanelGetNamespaces = (obj: any): obj is TMainPanelGetNamespaces => {
    return isTMainPanelGetResourceGroups(obj) && 'resourceGroupName' in obj;
};

export const isTMainPanelGetEventHubs = (obj: any): obj is TMainPanelGetEventHubs => {
    return isTMainPanelGetNamespaces(obj) && 'namespaceName' in obj;
};

export const isTMainPanelGetConsumerGroups = (obj: any): obj is TMainPanelGetConsumerGroups => {
    return isTMainPanelGetEventHubs(obj) && 'eventHubName' in obj;
};

export const isTMainPanelStartMonitoring = (obj: any): obj is TMainPanelStartMonitoring => {
    return obj && typeof obj === 'object' && 'consumerGroupName' in obj;
};
