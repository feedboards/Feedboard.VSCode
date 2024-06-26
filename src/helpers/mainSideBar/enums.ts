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
    singInWithAzure = 'singInWithAzure',
    openConnection = 'openConnection',
}

export enum ELoginType {
    oAuth = 'oAuth',
    connectionString = 'connectionString',
}
