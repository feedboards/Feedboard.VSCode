export enum EMainSideBarCommands {
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

export enum ELoginType {
    oAuth = 'oAuth',
    connectionString = 'connectionString',
}
