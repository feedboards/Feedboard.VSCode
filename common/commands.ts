export enum EPanelCommands {
    startMonitoring = 'startMonitoring',
    stopMonitoring = 'stopMonitoring',
    startMonitoringByConnectionString = 'startMonitoringByConnectionString',

    getEventHubs = 'getEventHubs',
    getConsumerGroups = 'getConsumerGroups',
    getIsLoggedInAzure = 'getIsLoggedInAzure',
    getConnection = 'getConnection',

    setMessages = 'setMessages',
    setEventHubs = 'setEventHubs',
    setConsumerGroups = 'setConsumerGroups',
    setIsLoggedInAzure = 'setIsLoggedInAzure',
    setConnection = 'setConnection',

    singInWithAzure = 'singInWithAzure',
    showError = 'showError',
}

export enum ESideBarCommands {
    getSavedConnections = 'getSavedConnections',
    getIsLoggedInAzure = 'getIsLoggedInAzure',
    getSubscriptions = 'getSubscriptions',
    getResourceGroups = 'getResourceGroups',
    getNamespaces = 'getNamespaces',
    getEventHubs = 'getEventHubs',
    getConsumerGroups = 'getConsumerGroups',

    setMessages = 'setMessages',
    setSubscriptions = 'setSubscriptions',
    setResourceGroups = 'setResourceGroups',
    setNamespaces = 'setNamespaces',
    setEventHubs = 'setEventHubs',
    setConsumerGroups = 'setConsumerGroups',
    setSavedConnections = 'setSavedConnections',
    setIsLoggedInAzure = 'setIsLoggedInAzure',

    addConnection = 'addConnection',
    removeConnection = 'removeConnection',
    updateConnection = 'updateConnection',
    openConnection = 'openConnection',

    singInWithAzure = 'singInWithAzure',
}
