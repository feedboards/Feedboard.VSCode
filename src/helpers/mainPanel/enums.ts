export enum EMainPanelCommands {
    startMonitoring = 'startMonitoring',
    stopMonitoring = 'stopMonitoring',
    startMonitoringByConnectionString = 'startMonitoringByConnectionString',

    getSubscriptions = 'getSubscriptions',
    getResourceGroups = 'getResourceGroups',
    getNamespaces = 'getNamespaces',
    getEventHubs = 'getEventHubs',
    getConsumerGroups = 'getConsumerGroups',
    getIsLoggedInAzure = 'getIsLoggedInAzure',

    setMessages = 'setMessages',
    setSubscriptions = 'setSubscriptions',
    setResourceGroups = 'setResourceGroups',
    setNamespaces = 'setNamespaces',
    setEventHubs = 'setEventHubs',
    setConsumerGroups = 'setConsumerGroups',
    setIsLoggedInAzure = 'setIsLoggedInAzure',

    singInWithAzure = 'singInWithAzure',
    showError = 'showError',
}
